import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import styles from './Header.module.css'
import logo from '../../assets/images/logo.png'

const Header = () => {
	const [menuOpen, setMenuOpen] = useState(false)
	const navigate = useNavigate()

	const validateToken = async () => {
		const token = localStorage.getItem('token') // Извлекаем токен из localStorage

		if (!token) {
			navigate('/login')
			return
		}

		try {
			const response = await api.post(
				'/validate-token',
				{},
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			)
			if (response.status === 200) {
				navigate('/profile')
			} else {
				navigate('/login')
			}
		} catch (error) {
			console.error('Token validation failed:', error)
			navigate('/login')
		}
	}

	const toggleMenu = () => {
		setMenuOpen(prevState => !prevState) // Переключаем состояние меню
	}

	const closeMenu = () => {
		setMenuOpen(false) // Закрываем меню при клике на ссылку
	}

	return (
		<header className={styles.header}>
			{/* Контейнер для гамбургера и лого */}
			<div className={styles.logoContainer}>
				<button className={styles.hamburger} onClick={toggleMenu}>
					<span className={styles.bar}></span>
					<span className={styles.bar}></span>
					<span className={styles.bar}></span>
				</button>

				{/* <Link to='/' className={styles.logo}>
					<img src={logo} alt='Logo' />
				</Link> */}
			</div>

			<nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
				<Link to='/' className={styles.navItem} onClick={closeMenu}>
					Home
				</Link>
				<Link to='/store' className={styles.navItem} onClick={closeMenu}>
					Store
				</Link>
				<Link to='/about' className={styles.navItem} onClick={closeMenu}>
					About Us
				</Link>
				<Link to='/contact' className={styles.navItem} onClick={closeMenu}>
					Contact Us
				</Link>
			</nav>

			<div className={styles.actions}>
				<Link to='/cart' className={styles.iconButton}>
					<i className='fa fa-shopping-cart'></i>
				</Link>
				<button onClick={validateToken} className={styles.iconButton}>
					<i className='fa fa-user'></i>
				</button>
			</div>
		</header>
	)
}

export default Header
