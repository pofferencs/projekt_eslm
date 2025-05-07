import {
  FaFacebookF,
  FaFacebook,
  FaInstagram,
  FaInstagramSquare,
} from "react-icons/fa";
import { FaLocationDot, FaPhone } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-zinc-800 text-base-content p-10 mt-auto">
       <div className="grid justify-items-center xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
      <aside>
        <a
          className="btn-link text-indigo-600 hover:no-underline hover:text-amber-600 flex no-underline items-center space-x-3"
          href="https://taszi.hu"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://taszi.hu/img/trefort_logo.png"
            width={100}
            alt="Trefort Logo"
          />
          <p>
            Békéscsabai Szakképzési Centrum
            <br />
            Trefort Ágoston Technikum, Szakképző Iskola és Kollégium
          </p>
        </a>
      </aside>

      <nav>
        <h6 className="font-bold uppercase">Telefonszám</h6>
        <span className="inline-flex items-center text-indigo-600 space-x-2 hover:text-amber-500">
          <FaPhone className="w-4 h-4" />
          <a href="tel:+36664445110">(06 66) 444 5110</a>
        </span>
      </nav>
      <nav>
        <h6 className="font-bold uppercase">Cím</h6>
        <span className="inline-flex items-center text-indigo-600 space-x-2 hover:text-amber-500">
          <FaLocationDot className="w-4 h-4" />
          <a
            href="https://www.google.com/maps/place/B%C3%A9k%C3%A9scsaba,+Puskin+t%C3%A9r+1,+5600/"
            target="_blank"
            rel="noopener noreferrer"
          >
            5600 Békéscsaba, Puskin tér 1.
          </a>
        </span>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3368.006338837443!2d21.10508117675354!3d46.68257845132696!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47442ba1581add3f%3A0x9e51def213503234!2zQsOpa8Opc2NzYWJhLCBQdXNraW4gdMOpciAxLCA1NjAw!5e1!3m2!1shu!2shu!4v1742262150872!5m2!1shu!2shu"
          width="360"
          height="280"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </nav>
      <nav>
        <h1 className="bg-gradient-to-r font-bold from-indigo-500 to-amber-500 inline-block text-transparent bg-clip-text">
          TREFORT E-SPORT
        </h1>
      </nav>
      </div>
    </footer>
  );
}

export default Footer;
