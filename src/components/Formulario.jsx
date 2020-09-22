import React, { useEffect, useState } from "react";
import styled from '@emotion/styled';
import Error from './Error'
import useMoneda from "../hooks/useMoneda";
import useCriptomoneda from "../hooks/useCriptomoneda";
import PropTypes from 'prop-types';
import axios from "axios";

const Boton = styled.input`
  margin-top: 20px;
  font-weight: bold;
  font-size: 20px;
  padding: 10;
  background-color: #66a2fe;
  border: none;
  width: 100%;
  border-radius: 10px;
  color: #fff;

  &:hover {
    background-color: #326ac0;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
`;

const Formulario = ({guardarMoneda, guardarCriptomoneda}) => {
  // State del listado de Criptomonedas
  const [listacripto, guardarCripto] = useState([]);
  // Validando el Formulario
  const [error, guardarError] = useState(false);

  const MONEDAS = [
    { codigo: "USD", nombre: "Dolar USA" },
    { codigo: "MXN", nombre: "Peso Mexicano" },
    { codigo: "EUR", nombre: "Euro" },
    { codigo: "GBP", nombre: "Libra Esterlina" },
    { codigo: "COD", nombre: "Peso Colombiano" },
  ];
  // Utilizar hook useMoneda
  const [moneda, SelectMonedas] = useMoneda("Elige tu Moneda", "", MONEDAS);

  // Utilizar hook useCriptomoneda
  const [criptomoneda, SelectCripto] = useCriptomoneda(
    "Elige tu criptomoneda",
    "",
    listacripto
  );

  // Ejecuar llamdo a la API
  useEffect(() => {
    const consultarAPI = async () => {
      const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

      const resultado = await axios.get(url);
      guardarCripto(resultado.data.Data);
    };
    consultarAPI();
  }, []);

  // Cuando el usuario hace submit
  const cotizarMoneda = (e) => {
    e.preventDefault();

    // Validar si ambos campos estan llenos
    if (moneda === "" || criptomoneda === "") {
      guardarError(true);
      return;
    }
    // pasar datos al componente pricipal
    guardarError(false);
    guardarMoneda(moneda);
    guardarCriptomoneda(criptomoneda);
    
  };

  return (
    <form onSubmit={cotizarMoneda}>
      {error ? <Error mensaje="Todos los campos son obligatorios" /> : null}
      <SelectMonedas />

      <SelectCripto />
      <Boton type="submit" value="calcular" />
    </form>
  );
};

Formulario.propTypes = {
  guardarMoneda: PropTypes.func.isRequired,
  guardarCriptomoneda: PropTypes.func.isRequired
}

export default Formulario;
