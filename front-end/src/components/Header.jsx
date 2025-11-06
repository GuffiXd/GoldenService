// src/components/Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const API_URL = "http://localhost:5000";

function Header() {
  return (
    <header className="flex justify-around items-center p-4 border pl-20 pr-20 text-xl">
      <div className="logo">
        <img src={`${API_URL}/images/icons/logo-header.svg`} alt="logo" className="h-10" />
      </div>
      <nav>
        <ul className="flex space-x-10">
          <li>
            <NavLink
              to="/main"
              className="hover:underline"
              activeClassName="font-bold"
            >
              Главная
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/catalog"
              className="hover:underline"
              activeClassName="font-bold"
            >
              Каталог
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/wholesale"
              className="hover:underline"
              activeClassName="font-bold "
            >
              Оптовая продажа
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className="hover:underline"
              activeClassName="font-bold"
            >
              О нас
            </NavLink>
          </li>
        </ul>
      </nav>
      <div className="number flex items-center space-x- gap-5">
        <img
          src={`${API_URL}/images/icons/phone-header.svg`}
          alt="call"
          className="h-6"
        />
        <h1 className="text-xl">+7 (966) 55 88 499</h1>
        <img
          src={`${API_URL}/images/icons/heart-header.svg`}
          alt="heart"
          className=""
        />
        <img src={`${API_URL}/images/icons/cart-header.svg`} alt="cart" className="" />
      </div>
    </header>
  );
}

export default Header;