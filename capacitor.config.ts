import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.aea8d343b7324ab0a90f17591deb113c',
  appName: 'A Lovable project',
  webDir: 'dist',
  server: {
    url: 'https://aea8d343-b732-4ab0-a90f-17591deb113c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;