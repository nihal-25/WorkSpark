//this is for city select dropdown in job form if needed later for easy selection of cities
//npm install react-select
import Select from "react-select";
import cities from "./indian-cities.json";

export default function CitySelect() {
  const options = cities.map((c) => ({ value: c.name, label: `${c.name}, ${c.state}` }));

  return (
    <Select
      options={options}
      placeholder="Select a city..."
      isSearchable
    />
  );
}
