import styles from './MaintenanceBanner.module.css'

export default function MaintenanceBanner({
    messages = ['⚠ UNDER MAINTENANCE', 'DO NOT ENTER'],
    diagonal = false,
}) {
    const repeated = [...messages, ...messages, ...messages, ...messages]

    const strip = (wrapClass, trackClass) => (
        <div className={wrapClass}>
            <div className={trackClass}>
                {repeated.map((msg, i) => (
                    <span key={i} style={{ display: 'contents' }}>
                        <span className={styles.tapeText}>{msg}</span>
                        <span className={styles.tapeSpacer} />
                    </span>
                ))}
            </div>
        </div>
    )

    if (diagonal) {
        return (
            <div
                data-aos="fade-in"
                data-aos-delay="200"
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
                {strip(styles.tapeWrapDiagonal, styles.tapeTrack)}
                {strip(styles.tapeWrapDiagonalReverse, styles.tapeTrackReverse)}
            </div>
        )
    }

    return strip(styles.tapeWrap, styles.tapeTrack)
}