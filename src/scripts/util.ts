export function isMobile(width: number): boolean {
	if (typeof window === "undefined") return false;
	return window.innerWidth < width;
}
