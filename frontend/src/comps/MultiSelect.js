import React, { useState } from 'react';
import CreatableSelect from 'react-select/creatable';


export default ({options, setOptions, value, setValue, handleCreate}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <CreatableSelect
      isMulti
      isClearable={true}
      isDisabled={isLoading}
      isLoading={isLoading}
      classNamePrefix="select"
      onChange={(newValue) => setValue(newValue)}
      onCreateOption={handleCreate}
      options={options}
      value={value}
    />
  );
};
