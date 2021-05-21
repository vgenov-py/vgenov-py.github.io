const get_distance = (user_lat, user_long, dea_lat, dea_long) => {
    c1 = (user_lat - dea_lat) ** 2;
    c2 = (user_long - dea_long) ** 2;
    result = (c1 + c2) ** 0.5;
    return result;
};
// The function below was implemented thanks to Tobias --> https://github.com/turbo87/ and specifically from this repository --> https://github.com/Turbo87/utm?id_curso=1574
function to_latlon(easting, northing) {
    const K0 = 0.9996;

    const E = 0.00669438;
    const E2 = E * E;
    const E3 = E2 * E;
    const E_P2 = E / (1 - E);

    const SQRT_E = Math.sqrt(1 - E);
    _E = (1 - SQRT_E) / (1 + SQRT_E);
    _E2 = _E * _E;
    _E3 = _E2 * _E;
    _E4 = _E3 * _E;
    _E5 = _E4 * _E;

    const M1 = 1 - E / 4 - (3 * E2) / 64 - (5 * E3) / 256;
    const M2 = (3 * E) / 8 + (3 * E2) / 32 + (45 * E3) / 1024;
    const M3 = (15 * E2) / 256 + (45 * E3) / 1024;
    const M4 = (35 * E3) / 3072;

    const P2 = (3 / 2) * _E - (27 / 32) * _E3 + (269 / 512) * _E5;
    const P3 = (21 / 16) * _E2 - (55 / 32) * _E4;
    const P4 = (151 / 96) * _E3 - (417 / 128) * _E5;
    const P5 = (1097 / 512) * _E4;

    const R = 6378137;

    const zone_letter = "N";
    const zone_number = 30;

    const x = easting - 500000;
    const y = northing;

    const m = y / K0;
    const mu = m / (R * M1);

    const p_rad =
        mu +
        P2 * Math.sin(2 * mu) +
        P3 * Math.sin(4 * mu) +
        P4 * Math.sin(6 * mu) +
        P5 * Math.sin(8 * mu);

    const p_sin = Math.sin(p_rad);
    const p_sin2 = p_sin * p_sin;

    const p_cos = Math.cos(p_rad);

    const p_tan = p_sin / p_cos;
    const p_tan2 = p_tan * p_tan;
    const p_tan4 = p_tan2 * p_tan2;

    const ep_sin = 1 - E * p_sin2;
    const ep_sin_sqrt = Math.sqrt(1 - E * p_sin2);

    const n = R / ep_sin_sqrt;
    const r = (1 - E) / ep_sin;

    const c = E_P2 * p_cos ** 2;
    const c2 = c * c;

    const d = x / (n * K0);
    const d2 = d * d;
    const d3 = d2 * d;
    const d4 = d3 * d;
    const d5 = d4 * d;
    const d6 = d5 * d;

    const latitude =
        p_rad -
        (p_tan / r) *
        (d2 / 2 - (d4 / 24) * (5 + 3 * p_tan2 + 10 * c - 4 * c2 - 9 * E_P2)) +
        (d6 / 720) *
        (61 + 90 * p_tan2 + 298 * c + 45 * p_tan4 - 252 * E_P2 - 3 * c2);

    let longitude =
        (d -
            (d3 / 6) * (1 + 2 * p_tan2 + c) +
            (d5 / 120) *
            (5 - 2 * c + 28 * p_tan2 - 3 * c2 + 8 * E_P2 + 24 * p_tan4)) /
        p_cos;

    function zone_number_to_central_longitude() {
        return (30 - 1) * 6 - 180 + 3;
    }
    // return (value + math.pi) % (2 * math.pi) - math.pi
    // ((a % n ) + n ) % n
    function mod_angle(value) {
        a = value + Math.PI;
        dividend = 2 * Math.PI;
        result = (((a % dividend) + dividend) % dividend) - Math.PI;
        return result;
    }

    function degrees_to_radians(degrees) {
        let pi = Math.PI;
        return degrees * (pi / 180);
    }

    function radians_to_degrees(radians) {
        let pi = Math.PI;
        return radians * (180 / pi);
    }

    longitude = mod_angle(
        longitude + degrees_to_radians(zone_number_to_central_longitude())
    );
    return [radians_to_degrees(latitude), radians_to_degrees(longitude)];
}

const get_nearest_deas = (user_lat, user_long, dataset) => {
    distances = [];
    x_utm = "direccion_coordenada_x";
    y_utm = "direccion_coordenada_y";

    dataset.map((dea) => {
        dea_latlng = to_latlon(dea[x_utm], dea[y_utm]);
        distance = get_distance(user_lat, user_long, dea_latlng[0], dea_latlng[1]);
        distances.push([dea, distance]);
    });

    distances.sort(function(a, b) {
        return a[1] - b[1];
    });
    return distances;
};

window.navigator.geolocation.getCurrentPosition((position) => {
    user_lat = position.coords.latitude;
    user_long = position.coords.longitude;
    fetch(
            "https://raw.githubusercontent.com/vgenov-py/projects/master/deas/deas.json"
        )
        .then((res) => res.json())
        .then((data) => {
            const result = get_nearest_deas(user_lat, user_long, data["data"]);
            other_deas_list = result.slice(1, 6);
            nearest_dea = result[0][0];
            const card_title = document.querySelector("#card_title");
            card_title.innerText =
                nearest_dea.direccion_ubicacion.length <= 4 ?
                "Dato no disponible" :
                nearest_dea.direccion_ubicacion;
            const horario_acceso = document.querySelector("#horario_acceso");
            horario_acceso.innerText =
                nearest_dea.horario_acceso.length <= 0 ?
                "Horario no disponible" :
                nearest_dea.horario_acceso;
            const other_deas = document.querySelector("#other_deas");
            const go_to_maps = document.querySelector("#go_to_maps");
            go_to_maps.innerText = "Ir a Maps";
            go_to_maps.target = "_blank";
            dea_latlng = to_latlon(
                nearest_dea.direccion_coordenada_x,
                nearest_dea.direccion_coordenada_y
            );
            go_to_maps.href = `https://www.google.com/maps/search/?api=1&query=${dea_latlng[0]},${dea_latlng[1]}`;
            other_deas_list.map((dea) => {
                const div = document.createElement("div");
                div.className = "d-flex justify-content-center";
                const ul = document.createElement("ul");
                ul.className = "list-group list-group-horizontal";
                const direccion_ubicacion = document.createElement("li");
                direccion_ubicacion.className = "list-group-item";
                const horario_acceso = document.createElement("li");
                horario_acceso.className = "list-group-item";
                const link_to_maps = document.createElement("li");
                link_to_maps.className = "list-group-item";
                const button = document.createElement("a");
                button.innerText = "Ir a Maps";
                button.className = "btn btn-success";
                dea_latlng = to_latlon(
                    dea[0].direccion_coordenada_x,
                    dea[0].direccion_coordenada_y
                );
                button.target = "_blank";
                button.href = `https://www.google.com/maps/search/?api=1&query=${dea_latlng[0]},${dea_latlng[1]}`;
                direccion_ubicacion.innerText =
                    dea[0].direccion_ubicacion.length <= 4 ?
                    "Dato no disponible" :
                    dea[0].direccion_ubicacion;
                horario_acceso.innerText =
                    dea[0].horario_acceso.length <= 0 ?
                    "Horario no disponible" :
                    dea[0].horario_acceso;
                link_to_maps.append(button);
                ul.append(direccion_ubicacion);
                ul.append(horario_acceso);
                ul.append(link_to_maps);
                div.append(ul);
                other_deas.append(div);
            });
        });
});