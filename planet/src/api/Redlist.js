import $ from 'jquery';

const Redlist = {

    token: "ce10b3e699ae19f3b02323c9a369bb626dbbf43c544429bc53404a154168935a",

    countryOccurence: async function (name) {
        
        var response = await $.ajax({
            url: "https://apiv3.iucnredlist.org/api/v3/species/countries/name/" + name,
            data: {
                token: this.token
                }
            });

        return response;
    },

    historicalAssessment: async function (name) {

        var response = await $.ajax({
            url: "https://apiv3.iucnredlist.org/api/v3/species/history/name/" + name,
            data: {
                token: this.token
                }
            });

        return response;
    },

    habitats: async function (name) {

        var response = await $.ajax({
            url: "https://apiv3.iucnredlist.org/api/v3/habitats/species/name/" + name,
            data: {
                token: this.token
                }
            });

        return response;

    }
}

export default Redlist