import { imageSet } from '../../assets/images.js'

/**
 * A plain `<picture>` around a plain `<img>`.
 *
 * Everything about source selection is native: the browser reads `srcset` and
 * `sizes` and picks a file. Nothing here measures the viewport, and no state,
 * effect or observer is involved — it only assembles the markup so the sections
 * do not each repeat three `<source>` elements.
 *
 * `width`/`height` are the intrinsic dimensions of the *master*, which pin the
 * aspect ratio and keep the box reserved before the bytes arrive.
 *
 * The `<picture>` carries `display: contents` (see `.responsive-picture` in
 * `index.css`), so it generates no box and the existing layout rules that
 * target the `<img>` keep working unchanged.
 */
function ResponsiveImage({
  name,
  sizes,
  alt,
  width,
  height,
  className = '',
  loading,
  fetchPriority,
  decoding = 'async',
  ...rest
}) {
  const { sources, src, srcSet } = imageSet(name)

  return (
    <picture className="responsive-picture">
      {sources.map((source) => (
        <source key={source.type} type={source.type} srcSet={source.srcSet} sizes={sizes} />
      ))}
      <img
        className={className}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        {...rest}
      />
    </picture>
  )
}

export default ResponsiveImage
