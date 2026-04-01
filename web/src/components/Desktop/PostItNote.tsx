const PostItNote = () => (
  <div
    style={{
      width: 180,
      height: 180,
      background: '#FF00FF',
      display: 'flex',
      flexDirection: 'column',
      padding: 20,
      position: 'relative',
    }}
  >
    {/* Tape strip */}
    <div
      style={{
        position: 'absolute',
        top: -6,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 60,
        height: 14,
        background: 'rgba(255, 255, 255, 0.45)',
        border: '1px solid rgba(0, 0, 0, 0.15)',
      }}
    />
    <p
      style={{
        fontFamily: "'DM Sans Variable', sans-serif",
        fontWeight: 800,
        fontSize: 18,
        lineHeight: 1.3,
        color: '#000',
        margin: 0,
        marginTop: 12,
      }}
    >
      &ldquo;Obsessed with perfect kerning.&rdquo;
    </p>
  </div>
)

export default PostItNote
