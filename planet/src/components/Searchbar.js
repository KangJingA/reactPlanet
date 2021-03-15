import React, {useState, useEffect} from 'react';
import SpeciesNameConvertor from '../api/SpeciesNameConvertor';
import Geocode from '../api/Geocode';

const removeDuplicatesBy = (keyFn, array) => {
    var mySet = new Set();
    return array.filter(function(x) {
        var key = keyFn(x), isNew = !mySet.has(key);
        if (isNew) mySet.add(key);
        return isNew;
    });
}

const Searchbar = () => {

    const [term, setTerm] = useState('');
    const [results, setResults] = useState([]);
    const [debouncedTerm,setDebouncedTerm] = useState(term);

    // only to update debounced term
    useEffect(()=> {

        // only search after 500ms
        const timeoutId = setTimeout(() => {
                setDebouncedTerm(term);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
        };
        
    },[term])

    //need to config to tell it when to run - empty array, array, no array at all
    useEffect(() => {
        
        //make request here
        const search = async () => {
            const response = await SpeciesNameConvertor(debouncedTerm);
            
            // get common species names 
            //const uniqueCommonNames = removeDuplicatesBy(x =>x.tsn, commonNames);
            
            setResults(response);
        };
        
        if (debouncedTerm) {
            search();
        };

    }, [debouncedTerm]); // only will run when term changes 

    // display common names 
    const renderedResults = results.map((result)=> {
        return (
            <div key={result.key} className="item">
                <div className="right floated content">
                    {result.species}
                </div>
            </div>
        )
    })
    return (
        <div>
            <div className="ui form">
                <div className="field">
                    <label>Enter Search Term</label>
                    <input 
                        value={term}
                        onChange={(event)=>{setTerm(event.target.value)}}
                        className="input"></input>
                </div>
            </div>
            <div className="ui celled list">{renderedResults}</div>
        </div>
    )
};

export default Searchbar;