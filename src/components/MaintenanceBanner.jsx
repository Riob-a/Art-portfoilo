import styles from './MaintenanceBanner.module.css'

export default function MaintenanceBanner({
    messages = ['⚠ UNDER MAINTENANCE', 'DO NOT ENTER'],
    diagonal = false,
}) {
    const repeated = [...messages, ...messages, ...messages, ...messages]
    const wrapClass = diagonal ? styles.tapeWrapDiagonal : styles.tapeWrap

    const banner = (
        <div className={wrapClass}>
            <div className={styles.tapeTrack}>
                {repeated.map((msg, i) => (
                    <span key={i} style={{ display: 'contents' }}>
                        <span className={styles.tapeText}>{msg}</span>
                        <span className={styles.tapeSpacer} />
                    </span>
                ))}
            </div>
        </div>
    )

    // diagonal needs a fixed full-viewport shell so it doesn't affect layout
    if (diagonal) {
        return (
            <div
                aria-label="Under maintenance"
                style={{
                    position: 'fixed',
                    inset: 0,
                    pointerEvents: 'all',
                    zIndex: 50,
                    overflow: 'hidden',
                    background: 'rgba(0, 0, 0, 0.65)',
                }}
            >
                {banner}
            </div>
        )
    }

    return banner
}