const Footer = () => {
    return (
        <footer>
            <p>&copy; {new Date().getFullYear()} ControlaCRM. Todos los derechos reservados.</p>
            <nav>
                <a href="/privacy">Privacidad</a>
                <a href="/terms">Términos</a>
            </nav>
        </footer>
    );
};

export default Footer;
