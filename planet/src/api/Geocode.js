import $ from 'jquery';

const Geocode = async () => {

    var response = await $.ajax({
        url: "http://www.mapquestapi.com/geocoding/v1/address",
        data: {
            key: "JZexfBmB86bpxI95FKXU4lsGd4Y6Nb6c",
            location: "Singapore",
            thumbMaps: false,
            maxResults: 5
        }
        

    })

    return response.results[0].locations;
}

export default Geocode;