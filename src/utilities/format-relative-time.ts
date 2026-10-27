const RELATIVE_TIME_UNITS = [
    ['year', 365 * 24 * 60 * 60 * 1000],
    ['month', 30 * 24 * 60 * 60 * 1000],
    ['week', 7 * 24 * 60 * 60 * 1000],
    ['day', 24 * 60 * 60 * 1000],
    ['hour', 60 * 60 * 1000],
    ['minute', 60 * 1000],
] as const

export function formatRelativeTime(timestamp: number, now: number = Date.now()) {
    const relativeTimeFormatter = new Intl.RelativeTimeFormat('zh-CN', { numeric: 'auto' })
    const difference = timestamp - now
    for (const [unit, unitMs] of RELATIVE_TIME_UNITS) {
        if (Math.abs(difference) >= unitMs) {
            return relativeTimeFormatter.format(Math.round(difference / unitMs), unit)
        }
    }
    return '刚刚'
}

// TODO: l10n here!
// 需要更改“管理推流令牌”和“管理受信任的浏览器”两个菜单页条目的CSS，用英语第二行详情排不下。
