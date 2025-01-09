import { useEffect, useState } from 'react';
import MealItem from './MealItem.jsx';
import useHttp from '../hooks/useHttp.js';
import Error from './Error.jsx';

const requestConfig = {};
export default function Meals () {
  const {data: loadedMeals, isLoading, error} =
    useHttp('http://localhost:3000/meals', requestConfig, []);
  if (isLoading) {
    return <p className="center">Data fetching ...</p>;
  }
  if (error) {
    return <Error title="failed to fetch data" message={error}/>;
  }
  // const [ loadedMeals, setLoadedMeals ] = useState([]);
  //
  // useEffect(() => {
  //   async function fetchMeals () {
  //     const response = await fetch('http://localhost:3000/meals');
  //     if (!response.ok) {
  //
  //     }
  //
  //     const meals = await response.json();
  //     setLoadedMeals(meals);
  //   }
  //
  //   fetchMeals();
  // }, []);

  return <ul id="meals">
    {loadedMeals.map(( meal ) =>
      <MealItem key={meal.id} meal={meal}/>)}
  </ul>;
}