import { Image, type ImageProps } from '@mantine/core';

interface OptimizedImageProps extends ImageProps {
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  alt?: string;
}

export function OptimizedImage({
  priority = false,
  src,
  loading,
  decoding,
  alt = '',
  fallbackSrc = 'https://freesvg.org/img/ftkrecipes.png',
  ...others
}: OptimizedImageProps) {
  return (
    <Image
      src={src}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding={decoding ?? (priority ? 'sync' : 'async')}
      fallbackSrc={fallbackSrc}
      alt={alt}
      {...others}
    />
  );
}
