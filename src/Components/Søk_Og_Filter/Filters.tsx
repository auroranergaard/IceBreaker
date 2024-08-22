import {Checkbox} from '@mantine/core';

type FilterProps = {
  category: string;
    selectedFilters: string[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  };

  const Filter = ({category, selectedFilters, setSelectedFilters}: FilterProps) => {
    const isChecked = selectedFilters.includes(category);

  const handleChange = () => {
      if (isChecked) {
          setSelectedFilters(selectedFilters.filter(filter => filter !== category));
      } else {
          setSelectedFilters([...selectedFilters, category]);
      }
  };

    return (
        <Checkbox
        onChange={handleChange}
        label={category}
      /> 
    );
}

export default Filter;