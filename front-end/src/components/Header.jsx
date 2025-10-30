// src/components/Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="flex justify-between items-center p-4 border pl-20 pr-20 text-xl">
      <div className="logo">
        <img src="/LogoGS.jpg" alt="logo" className="h-10" />
      </div>
      <nav>
        <ul className="flex space-x-6">
          <li>
            <NavLink to="/main" className="hover:underline" activeClassName="font-bold">
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink to="/catalog" className="hover:underline" activeClassName="font-bold">
              Каталог
            </NavLink>
          </li>
          <li>
            <NavLink to="/wholesale" className="hover:underline" activeClassName="font-bold ">
              Оптовая продажа
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="hover:underline" activeClassName="font-bold">
              О нас
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="number flex items-center space-x-2 gap-5">
        <img src="/phone-call.jpg" alt="call" className="h-6" />
        <h1 className="text-xl">+7 (966) 55 88 499</h1>
        <img src="../public/heart-icon.jpg" alt="heart" />
        <img src="../public/cart-icon.jpg" alt="cart" />
      </div>
    </header>
  );
}

export default Header;