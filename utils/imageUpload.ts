import * as ImagePicker from 'expo-image-picker';

import { storageBuckets, supabase } from '@/lib/supabase';

const MAX_IMAGE_COUNT = 10;

export interface LocalImageAsset {
  uri: string;
  mimeType: string;
  fileName: string;
  width: number | null;
  height: number | null;
}

function buildAssetFileName(uri: string, fallbackPrefix: string) {
  const lastSegment = uri.split('/').pop()?.split('?')[0]?.trim();

  if (lastSegment) {
    return lastSegment;
  }

  return `${fallbackPrefix}-${Date.now()}.jpg`;
}

function normalizeAsset(asset: ImagePicker.ImagePickerAsset, index: number): LocalImageAsset {
  return {
    uri: asset.uri,
    mimeType: asset.mimeType ?? 'image/jpeg',
    fileName: asset.fileName ?? buildAssetFileName(asset.uri, `artbud-image-${index + 1}`),
    width: asset.width ?? null,
    height: asset.height ?? null,
  };
}

function dedupeAssets(current: LocalImageAsset[], incoming: LocalImageAsset[]) {
  const seen = new Set<string>();
  const merged = [...current, ...incoming].filter((asset) => {
    if (seen.has(asset.uri)) {
      return false;
    }

    seen.add(asset.uri);
    return true;
  });

  return merged.slice(0, MAX_IMAGE_COUNT);
}

async function ensureMediaLibraryPermission() {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Photo library access is needed before you can add artwork to a post.');
  }
}

async function ensureCameraPermission() {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Camera access is needed before you can capture artwork for a post.');
  }
}

export async function pickImagesFromLibrary(existingAssets: LocalImageAsset[]) {
  await ensureMediaLibraryPermission();

  const remainingSlots = Math.max(0, MAX_IMAGE_COUNT - existingAssets.length);

  if (remainingSlots === 0) {
    return existingAssets;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    allowsMultipleSelection: true,
    mediaTypes: ['images'],
    quality: 0.9,
    selectionLimit: remainingSlots,
  });

  if (result.canceled) {
    return existingAssets;
  }

  return dedupeAssets(existingAssets, result.assets.map(normalizeAsset));
}

export async function captureImage(existingAssets: LocalImageAsset[]) {
  await ensureCameraPermission();

  if (existingAssets.length >= MAX_IMAGE_COUNT) {
    return existingAssets;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    cameraType: ImagePicker.CameraType.back,
    mediaTypes: ['images'],
    quality: 0.9,
  });

  if (result.canceled) {
    return existingAssets;
  }

  return dedupeAssets(existingAssets, result.assets.map(normalizeAsset));
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, '-');
}

export async function uploadPostImages(userId: string, assets: LocalImageAsset[]) {
  const uploads = await Promise.all(
    assets.map(async (asset, index) => {
      const response = await fetch(asset.uri);
      const arrayBuffer = await response.arrayBuffer();
      const extension = asset.fileName.includes('.') ? '' : '.jpg';
      const filePath = `${userId}/${Date.now()}-${index}-${sanitizeFileName(asset.fileName)}${extension}`;

      const { error } = await supabase.storage
        .from(storageBuckets.postImages)
        .upload(filePath, arrayBuffer, {
          contentType: asset.mimeType,
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data } = supabase.storage.from(storageBuckets.postImages).getPublicUrl(filePath);
      return data.publicUrl;
    }),
  );

  return uploads;
}

export function getMaxImageCount() {
  return MAX_IMAGE_COUNT;
}
