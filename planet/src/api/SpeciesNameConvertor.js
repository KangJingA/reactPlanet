import $ from 'jquery';

const SpeciesNameConvertor = async (species) => {

    // var response = await $.ajax({
    //     url: "https://www.itis.gov/ITISWebService/jsonservice/searchByCommonNameBeginsWith",
    //     mode: 'cors',
    //     type: "get",
    //     data: {"srchKey": species}, // to search
    //     dataType: "jsonp", // using jsonp to remove CORS error
    //     jsonp: "jsonp", // replace callback= with jsonp= instead, requirements based on the docs
    //     jsonpCallback: 'itis_data', // arbitary callback function. json data is wrapped in this function. need to parse this function to extract your data
    //     contentType: 'application/json; charset=utf-8',
    //     crossDomain : true,
    //     cache: true, // remove the timestamp at the end of the request
    //     error: (error) => console.log(error)})

    // return response.commonNames;

    var response = await $.ajax({
        url: "https://api.gbif.org/v1/species/search",
        mode: 'cors',
        type: "get",
        data: {"q": species}, // to search
        dataType: "json",
        crossDomain : true,
        cache: true, 
        error: (error) => console.log(error)})

    return response.results;
}
// grab tsn and common name 

export default SpeciesNameConvertor;
