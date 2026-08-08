import gsap from "gsap";

const mm = gsap.matchMedia();

mm.add(
	{
		isMobile: "(max-width: 1399px)",
		isDesktop: "(min-width: 1400px)",
		reduceMotion: "(prefers-reduced-motion: reduce)",
	},
	(context) => {
		const { isMobile, reduceMotion } = context.conditions ?? {};
		const drawer = document.querySelector<HTMLElement>("[data-menu]");
		const button = document.querySelector<HTMLElement>("[data-menu-button]");
		const main = document.querySelector<HTMLElement>("[data-main]");

		if (!drawer || !button || !main || !isMobile) return;

		let open = false;
		const duration = reduceMotion ? 0 : 0.3;

		const setOpen = (value: boolean) => {
			open = value;
			button.setAttribute("data-open", String(value));
			gsap.to(drawer, {
				xPercent: value ? 0 : -100,
				duration,
				ease: "power2.out",
			});
		};

		gsap.set(drawer, { xPercent: -100 });

		const onButtonClick = () => setOpen(!open);
		const onMainClick = () => {
			if (open) setOpen(false);
		};
		const onNavClick = () => {
			if (open) setOpen(false);
		};

		button.addEventListener("click", onButtonClick);
		main.addEventListener("click", onMainClick);
		drawer.querySelectorAll("[data-nav-link]").forEach((link) => {
			link.addEventListener("click", onNavClick);
		});

		return () => {
			button.removeEventListener("click", onButtonClick);
			main.removeEventListener("click", onMainClick);
			drawer.querySelectorAll("[data-nav-link]").forEach((link) => {
				link.removeEventListener("click", onNavClick);
			});
		};
	},
);
