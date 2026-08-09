import gsap from "gsap";

const layers = gsap.utils.toArray<HTMLElement>("[data-layer]");
if (layers.length > 0) {
	const mm = gsap.matchMedia();

	mm.add(
		{
			reduceMotion: "(prefers-reduced-motion: reduce)",
			noPreference: "(prefers-reduced-motion: no-preference)",
		},
		(context) => {
			const { reduceMotion, noPreference } = context.conditions ?? {};
			let index = 0;

			const show = (i: number, duration: number) => {
				layers.forEach((layer, layerIndex) => {
					layer.setAttribute("data-active", String(layerIndex === i));
					layer.setAttribute("aria-hidden", String(layerIndex !== i));
					gsap.to(layer, {
						autoAlpha: layerIndex === i ? 1 : 0,
						duration,
						ease: "power2.inOut",
						overwrite: "auto",
					});
				});
			};

			const advance = () => {
				index = (index + 1) % layers.length;
				show(index, reduceMotion ? 0 : 3);
			};

			if (noPreference) {
				let interval = window.setInterval(advance, 4000);
				const switcher = document.querySelector<HTMLElement>("[data-switcher]");
				const pause = () => window.clearInterval(interval);
				const resume = () => {
					pause();
					interval = window.setInterval(advance, 4000);
				};
				const onPause = () => pause();
				const onResume = () => resume();
				switcher?.addEventListener("pointerenter", onPause);
				switcher?.addEventListener("pointerleave", onResume);
				switcher?.addEventListener("focusin", onPause);
				switcher?.addEventListener("focusout", onResume);
				return () => {
					pause();
					switcher?.removeEventListener("pointerenter", onPause);
					switcher?.removeEventListener("pointerleave", onResume);
					switcher?.removeEventListener("focusin", onPause);
					switcher?.removeEventListener("focusout", onResume);
				};
			}
		},
	);
}
