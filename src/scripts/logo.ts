import gsap from "gsap";

const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: reduce)", () => {
	gsap.set(
		".logo-bg, .logo-seed, .logo-tree-left path, .logo-tree-right path",
		{ autoAlpha: 1 },
	);
});

mm.add("(prefers-reduced-motion: no-preference)", () => {
	const paths = gsap.utils.toArray<SVGPathElement>(
		".logo-tree-left path, .logo-tree-right path",
	);
	gsap.set(paths, {
		strokeDasharray: 100,
		strokeDashoffset: 100,
		autoAlpha: 0,
	});
	gsap.to(paths, {
		strokeDashoffset: 0,
		autoAlpha: 1,
		duration: 2.2,
		delay: 0.8,
		stagger: 0.18,
		ease: "power2.inOut",
	});
	gsap.to(".logo-seed", { autoAlpha: 1, duration: 1.8, delay: 0.5 });
	gsap.to(".logo-bg", { autoAlpha: 1, duration: 2.5, delay: 0.8 });
});
