# Profile Image Upload Setup Guide

## What's New

I've created a custom profile image upload UI to replace the Cloudinary widget. This provides a better user experience with:

- ✅ Drag-and-drop file upload
- ✅ Click-to-browse file selection
- ✅ Real-time upload progress indicator
- ✅ Image preview before upload
- ✅ File size and format validation
- ✅ Custom, branded UI matching your design system
- ✅ Success/error notifications with Sonner toast

## Components Created

### 1. **ProfileImageUploader** (`src/components/settings/ProfileImageUploader.tsx`)

The main upload component with:

- Drag-and-drop zone
- File selection button
- Upload progress animation
- Pre-upload validation (5MB max, supported formats: JPEG, PNG, WebP, GIF)
- Automatic update to backend after successful upload

### 2. **Updated UserProfileSettings** (`src/components/settings/UserProfileSettings.tsx`)

- Replaced CldUploadWidget with ProfileImageUploader
- Removed dependency on next-cloudinary CldUploadWidget
- Cleaner, more maintainable code

## Cloudinary Setup Required

To enable uploads, you need to configure an **unsigned upload preset** in your Cloudinary account:

### Steps:

1. Go to your [Cloudinary Dashboard](https://cloudinary.com/console)
2. Navigate to **Settings** → **Upload**
3. Scroll to **Upload presets** section
4. Click **Add upload preset**
5. Configure as follows:
   - **Name:** `watmean_profile`
   - **Signing Mode:** `Unsigned`
   - **Folder:** `watmean/profiles` (recommended for organization)
   - **Allowed formats:** jpg, png, webp, gif
   - **Max width/height:** Leave as default
   - Click **Save**

### Alternative (More Secure):

If you prefer not to use unsigned uploads, you can implement signed uploads. The infrastructure is already in place via the `/api/sign-cloudinary-params` endpoint.

## How It Works

1. **User selects/drags image** → File validation occurs
2. **Image preview is displayed** → User sees what they're uploading
3. **Upload starts** → Progress bar animates
4. **File uploads to Cloudinary** → Direct upload using your preset
5. **Backend updates** → Calls `/api/users/profile-image` endpoint
6. **Profile displays new image** → Toast notification confirms success

## Environment Variables

Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Files Modified/Created

- ✅ **Created:** `src/components/settings/ProfileImageUploader.tsx`
- ✅ **Updated:** `src/components/settings/UserProfileSettings.tsx`
  - Removed: `CldUploadWidget` import and usage
  - Added: `ProfileImageUploader` integration
  - Removed: Manual Cloudinary error handling (now in ProfileImageUploader)

## Testing

1. Navigate to **Settings** → **Profile** for both Student and Teacher dashboards
2. Click on the profile upload area or drag-and-drop an image
3. Verify:
   - ✅ File validation occurs
   - ✅ Upload progress displays
   - ✅ Profile image updates after upload
   - ✅ Toast notifications appear
   - ✅ Image persists on page refresh

## UI Features

- **Drag-and-drop zone:** Visual feedback on hover and drag
- **Progress circle:** Accurate progress percentage display
- **Image preview:** Shows selected file before upload
- **Status badges:** Green checkmark when image is saved
- **Error handling:** Clear error messages for invalid files
- **Animations:** Smooth transitions and hover effects
- **Responsive:** Works on mobile, tablet, and desktop

## TypeScript Support

Both components are fully typed with TypeScript interfaces for type safety.

## Troubleshooting

### "Upload preset 'watmean_profile' not found"

- Verify the preset is created in your Cloudinary dashboard
- Check the exact name matches (case-sensitive)

### Files not uploading

- Check that `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is set correctly
- Verify network requests in browser DevTools
- Check Cloudinary dashboard for upload activity

### Profile image not updating

- Ensure `/api/users/profile-image` endpoint is working
- Check browser console for error messages
- Verify user authentication is valid

---

**Ready to use!** The upload UI will now appear in both Teacher and Student settings pages.
