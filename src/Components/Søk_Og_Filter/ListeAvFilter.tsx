import {Group} from '@mantine/core';
import Filter from './Filters';


const filterdataDEMO = () => {
    return [
        {category:"Drikkelek"},
        {category:"Barnevennlig"},
        {category:"Utendørs"},
    ];
}

type ListeAvFiltersProps = {
    selectedFilters: string[];
    setSelectedFilters: React.Dispatch<React.SetStateAction<string[]>>;
  };

function ListeAvFilters({selectedFilters, setSelectedFilters}: ListeAvFiltersProps) {
    return (
        <Group>
            {filterdataDEMO().map((filter) => (
                <Filter 
                key={filter.category} 
                category={filter.category} 
                selectedFilters={selectedFilters} 
                setSelectedFilters={setSelectedFilters}/>
            ))}
        </Group>
    );
}

export default ListeAvFilters;