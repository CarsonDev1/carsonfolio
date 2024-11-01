import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Typed from 'typed.js';
import gsap from 'gsap';
import Button from '../Button/Button';
import Profiles from '../Profiles/Profiles';
import styles from './Hero.module.scss';
import { MENULINKS, TYPED_STRINGS } from '../../constants';
import Avatar from '../../public/lottie/carson.jpg';

const options = {
	strings: TYPED_STRINGS,
	typeSpeed: 50,
	startDelay: 1500,
	backSpeed: 50,
	backDelay: 8000,
	loop: true,
};

const Hero = () => {
	const [lottie, setLottie] = useState(null);

	const sectionRef = useRef(null);
	const typedElementRef = useRef(null);
	const lottieRef = useRef(null);
	const avatarRef = useRef(null);

	useLayoutEffect(() => {
		const ctx = gsap.context(() => {
			gsap.timeline({ defaults: { ease: 'none' } })
				.to(sectionRef.current, { opacity: 1, duration: 2 })
				.from(
					sectionRef.current.querySelectorAll('.staggered-reveal'),
					{ opacity: 0, duration: 0.5, stagger: 0.5 },
					'<'
				);
		});

		return () => ctx.revert();
	}, []);

	useEffect(() => {
		const typed = new Typed(typedElementRef.current, options);

		return () => typed.destroy();
	}, [typedElementRef]);

	useEffect(() => {
		import('lottie-web').then((Lottie) => setLottie(Lottie.default));
	}, []);

	// 3D tilt effect using GSAP
	useEffect(() => {
		const avatar = avatarRef.current;

		const handleMouseMove = (e) => {
			const rect = avatar.getBoundingClientRect();
			const x = e.clientX - rect.left - rect.width / 2;
			const y = e.clientY - rect.top - rect.height / 2;

			gsap.to(avatar, {
				rotationY: x / 10,
				rotationX: -y / 10,
				duration: 0.2,
			});
		};

		avatar.addEventListener('mousemove', handleMouseMove);
		avatar.addEventListener('mouseleave', () => {
			gsap.to(avatar, { rotationX: 0, rotationY: 0, duration: 0.5 });
		});

		return () => {
			avatar.removeEventListener('mousemove', handleMouseMove);
			avatar.removeEventListener('mouseleave', () => {
				gsap.to(avatar, { rotationX: 0, rotationY: 0, duration: 0.5 });
			});
		};
	}, []);

	return (
		<section
			ref={sectionRef}
			id={MENULINKS[0].ref}
			className='w-full flex md:items-center py-8 2xl:container mx-auto xl:px-20 md:px-12 px-4 min-h-screen relative mb-24'
			style={{ opacity: 0 }}
		>
			<style global jsx>
				{`
					.typed-cursor {
						font-size: 2rem;
					}
					.avatar-3d {
						transform-style: preserve-3d;
						perspective: 1000px;
						transition: transform 0.5s ease-out;
					}
				`}
			</style>
			<div className='flex flex-col pt-40 md:pt-0 select-none'>
				<h5 className={`${styles.intro} font-mono font-medium text-indigo-light staggered-reveal`}>
					Hi, my name is
				</h5>
				<h1 className={`${styles.heroName} text-white text-6xl font-semibold`}>
					<span className={`relative ${styles.emphasize} staggered-reveal`}>Carson</span>
				</h1>
				<p>
					<span
						ref={typedElementRef}
						className='staggered-reveal text-3xl text-gray-light-3 font-mono leading-relaxed'
					/>
				</p>
				<div className='staggered-reveal'>
					<Profiles />
				</div>
				<div className='staggered-reveal pt-4'>
					<Button href={`#${MENULINKS[4].ref}`} classes='link' type='primary'>
						Let&apos;s Talk
					</Button>
				</div>
			</div>
			<div className='absolute invisible w-1/4 bottom-4.5 lg:visible lg:right-12 2xl:right-16'>
				<img ref={avatarRef} src='/lottie/carson.jpg' alt='avatar' className='rounded-xl avatar-3d' />
			</div>
		</section>
	);
};

export default Hero;
