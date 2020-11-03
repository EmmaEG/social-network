import { Injectable } from '@angular/core';
import { GLOBAL } from './global';

@Injectable()
export class UploadService {
    public url: string;

    constructor() {
        this.url = GLOBAL.url;
    }

    //metodo para enviar datos, imagenes y nos permite hacer peticiones para subir un archivo
    // lo vamos a hacer con una promesa para poder tener el metodo then y ejecutarlo una vez que suceda la subida del archivo
    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string) {
        return new Promise(function(resolve, reject) {
            let formData: any = new FormData();
            let xhr = new XMLHttpRequest(); //objeto que nos perimte hacer peticiones ajax en JS puro

            for ( let i = 0; i < files.length; i++) { // si i es menor a la cantidad de ficheros i++
                formData.append(name, files[i], files[i].name); // por cada fichero añadimos al formulario el nuevo fichero, con el nombre que pasamos por parametro en este caso era image, le añadimos el fichero que estamos recorriendo y luego el nombre del fichero que recorrimos
            }
            // peticion ajax
            xhr.onreadystatechange = function() {
                if(xhr.readyState == 4) { // tiene que ser 4
                    if(xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            }
            // ahora si la peticion
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Authorization', token);
            xhr.send(formData);
        });
    }
}

/*
 makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string)
la url será la url del metodo del api
name es el nombre del fichero o el campo que el backend va a recibir
*/