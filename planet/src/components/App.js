import React from 'react';
// import QRreader from './QRreader';
import Redlist from '../api/Redlist';
import Globe from './Globe';
import Searchbar from './Searchbar';
//import SpeciesNameConvertor from '../api/SpeciesNameConvertor'

const App = () => {

    return (
        <div>
            <Searchbar></Searchbar>
            <Globe></Globe>
        </div>
    )
}

export default App;