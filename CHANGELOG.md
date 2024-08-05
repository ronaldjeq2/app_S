## 1.9.4

- **[api, app]** Se resolvió el issue de lista de cumpleaños repetida.#141
- **[ app]** Se actualizó a la nueva versión de react-native 6.4
## 1.9.3

- **[api, app]** Se resolvió el issue de cronograma de pagos con información nula .#132
- **[ api]** Creación de UnitTest #128

## 1.9.2

- **[api, app]** Se resolvió el issue de assitencia para cursos virtuales.#134
- **[app, api]** Se resolvió el issue de listado de cumpleaños para la fecha de 29 de febrero #135


## 1.9.1

- **[api, app]** Se resolvió el issue de assitencia para cursos virtuales.#134
- **[app, api]** Se resolvió el issue de listado de cumpleaños para la fecha de 29 de febrero #135

## 1.9.0

- **[api, app]** Se creo el endpoint para la obtencion del carnet de trabajador.!112
- **[app, api]** Se creó las altertas para sugerir o forzar una actualización de la app
  visualización. !110
- **[app, api]** Se modificó la app y el api para obtener asistencia de cursos con valores nulos. !111

## 1.8.0

- **[api, app]** Se creó la opción de control de asistencias tanto en el api como en el app. !102
- **[app, api]** Creación de la vista para los datos académicos del alumno y la actualización del endpoint de informacion del estudiante para obtener dicha información !105
  visualización. !103
  -- **[app]** Modulo de cursos offline !108

## 1.7.2

- **[api, app]** Se corrigio un bug en la app en la lista de cumpleaños, las fechas no coincidian con lo obtenido por el api. !81
- **[api, app]** Se agregó validación de datos personales cuando se obtienen datos nulos y la visualización de datos activos (correo, telefono). !101

## 1.7.1

- **[api, app]** Se corrigio un bug en el endpoint de horario por periodo, cuando no tenia dias asignados en el horario. !74
- **[app]** Se corrigieron los textos y estilos requeridos en el issue #99
- **[app]** Se agrego la funcionalidad de mostrar la contraseña #98 !75
- **[api, app]** Se añadióel endpoint de detalle de la app y se modificó el screen para su visualización. !103

## 1.7.0

- **[api]** Se agrego el endpoint para obtener el cronograma de pagos
- **[api]** Se agrego el endpoint para obtener el horario de un periodo
- **[api]** Se restringio el enpoint fotos para que muestre solo las del tipo "C" a5b4fea47dd696663c8e08dae6123754d83d9d51

## 1.6.2

**Mejoras**

- **[app]** Añadiendo WalkThoughScreen

**Correcciones**

## 1.6.1

**Mejoras**

- **[app]** Se modifico el app para que solo haga descarga total de datos del modo offline cuando no tenga datos anteriores 45ead019948b37ec570e3acf036bad06ebf80ac2
- **[app]** Se agrego una variable para controlar el tiempo maximo de espera en las solicitudes del API
- **[app]** Se agrego el token de authorizacion por defecto para todas las llamadas al API d46c06eee905affbf0eef3f2a3d56f941afec524
- **[app]** Se agrego la sincronizacion de tags y envio de token de oneSignal 8449287e81cc16864a61fa88933839c8b73d2b15

**Correcciones**

- **[app]** Se corrigio el congelamiento de la pantalla al momento de cerrar sesion 192fb0be97cc17a4fd00194ac3643c03ddee74a9

## 1.6.1

[Todos los commits](https://gitlab.com/senati/senati-movil/compare/v1.6.0...v1.6.1)

**Mejoras**

- **[app]** Se agrego la fecha de ultima sincronizacion en el mensaje para cuando este en modo offline
- **[api]** Se actualizo la documentacion de swagger
- **[web]** Se actualizaron las capturas de pantalla con la nueva version !68

**Correcciones**

- **[app]** Corrección del error al darle cancelar en los permisos !64 e0abb106cccb72ec1d1adb37b0e999d9639e2705
- **[app]** Correción de advertencia de accesibility label duplicado.
- **[app]** Corrección del modo off line ( términos de uso deshabilitados )
- **[app]** Correción del color de las alertas en el ErrorText .
- **[app]** Correción del listado de días en la sección cumpleaños.
- **[app]** Correccion del error al darle cancelar en los permisos !64 e0abb106cccb72ec1d1adb37b0e999d9639e2705
- **[app]** Correcion de advertencia de accesibility label duplicado !64 a1f87a353230725a4ac0a17f79c74d2d281e4760
- **[app]** Se corrigieron varios errores ortograficos
- **[app]** Se corrigio el error que no mostraba el saludo de cumpleaños en la fecha
- **[web]** Se corrigio el parpadeo que ocurria al entrar a la web !68

## 1.6.0

[Todos los commits](https://gitlab.com/senati/senati-movil/compare/v1.5.1...v1.6.0)

**Mejoras**

- **[app]** Se realizo el cambio de los metodos fecth a Axios para los request !63
- **[app]** Se modifico el componenente de error para que se muestre mensajes deacuerdo a la consulta !63
- **[api]** Se cambio la respuesta del getStudentCardInfo a {} cuando la carrera del estudiante no es dual en!63
- **[web]** Se cambiaron los screenshots en la web de la app !66 89ffed26a2d0dc9428e0d85f880b7c39298779ea
- **[app]** Se cambiaron las imagenes de los iconos del home !66 5dd2d12b661025136a184dc7c26dfe56415e1d32
- **[app]** Se añadio eslint al proyecto para usar la guia de estilo de codigo airbnb !91 c51e107c41b19e9a85e55abf571ada875bfe3fba
- **[app]** Se añadio el comando clear al package json para borrar la cache del proyecto !66 fdedd353adcf10886f7e138071a9de7fd5abf4ba
- **[app]** Se implemento el uso de REDUX para manejar el flujo de datos dentro del APP !66
- **[app]** Se cambio la libreria react-router-flux por react-nativigation para el manejo pantallas !66
- **[app]** Se rediseño el Login !66
- **[app]** Se rediseño el Home !66
- **[app]** Se rediseño la pantalla de cumpleaños !66
- **[app]** Se rediseño la pantalla de mi cuenta !66
- **[app]** Se eliminaron las pantallas y componentes no utilizados !66
- **[app]** Se rediseño la funcionalidad de SINFO !66

* **[app]** Se realizo el cambio de los metodos fecth a Axios para los request !63
* **[app]** Se modifico el componenente de error para que se muestre mensajes deacuerdo a la consulta !63
* **[apI]** Se cambio la respuesta del getStudentCardInfo a {} cuando la carrera del estudiante no es dual en!63

**Correcciones**

- **[app]** Se corrigieron y agregaron los logs y las captura de excepciones por medio de Crashlytics !63
- **[app]** Se corrigio el error que aparecia al darle cancelar a los permisos !69 907d340f0c6074927081c5e04e8cd3b4517494da

## 1.5.1

[Todos los commits](https://gitlab.com/senati/senati-movil/compare/v1.5.0...v1.5.1)

- **[web]** Se cambiaron los ìconos del landing en app.senati.edu.pe !61
- **[app]** Se cambiaron las dimensiones en el walkthroguh en proporcion al tamaño del dispositivo !64
- **[app]** Se cambiaron los detalles de los logs para crashlytics !64
- **[app]** Se cambiaron las dimensiones de los textos del login y se cambio el bloquedo de pantalla vertical en el home para aquellos con un tamaño menor a 600 !64

## 1.5.1

**Mejoras**

- **[app]** Se agregó animaciones de los inputtext y la imagen del logo cuando se activa el keyboard . bf48dbf29f5e82cde8a2762120e9ccc77e3cb233
- **[app]** Se añadio un bloqueo de orientacion cuando la pantalla del dispositivo tiene un tamaño menor a 500 !51
- **[api]** Se agrego en el horario el texto N/A para las clases que no tengan aulas !57
- **[api]** Se agrego en el horario el texto 'Docente no asignado' para las clases que no tengan docente asignado !57
- **[app]** Se hizo la integracion de Fabric Answers y Crashlytics al app

**Correcciones**

- **[app]** Se cambió la versión del onesignal. !49 6e83c5b103f09007a3e9bf0095094dcfdfaf34bd
- **[app]** Se corrigio el bug de los inputText del login !49
- **[app]** Se eliminó el componente Logo. !49 c0503431239d925a09cd51f3a9a75270cf797846
- **[app]** Se corrigio el metodo usado en la llamada a la foto en la vista de fotocheck !49 6e3f335321a5ff7b65bb129ea3e8439e4d544477
- **[app]** Se corrigio el direccionamiento del walk !51
- **[app]** Se corrigio el el tamaño de los iconos para su visualizacion en ipadpro y se quito la configuracion de actualizaciones persistentes de la ubicacion (UIBackgroundModes) !51 6e3f335321a5ff7b65bb129ea3e8439e4d544477
- **[api]** Se modifico la longitud maxima de la contraseña a 255 caracteres !54
- **[app]** Se corrigio el padding de los inputs en ios 10707c306a69f06370eb591e4f6003d6c41caa59
- **[app, api]** Se modifico la longitud maxima de la contraseña a 15 caracteres !55
- **[api]** Se corrigio el bug que solo retornaba los horarios si tenia clases dentro la fecha de consulta, ahora se toman los que esten 30 dias antes o despues !56
- **[api]** Se corrigio el bug que no mostraba el horario de los cursos sin docente !57
- **[api]** Se corrigio el bug que no mostraba el horario !59

## 1.5.0

[Todos los commits](https://gitlab.com/senati/senati-movil/compare/v1.4.2...v1.5.0)

**Mejoras**

- **[app, api]** Se agrego funcionalidad para sincronizar los tags con oneSignal y el envio de tokens al server !42
- **[app]** Se hicieron mejoras al login (-username- input tipo numerico, autfocus) 78b7b270469d8c30e7be370a12c67bba1ec5a1de
- **[app]** Se agrego una animacion de carga y foto por defecto a la vista de fotocheck !40
- **[app]** Se agrego la vista de configuracion !37
- **[app]** Se agrego funcionalidad para ver el fotocheck !23
- **[api]** Se agrego endpoint '[GET] /student/card' obtener los datos del fotocheck de un alumno. b56e91d9eba3fd6a3a2e671756ac8264a874434c
- **[api]** Se agrego endpoint '[GET] /student/card/photo/{toke}' obtener la foto del alumno. b56e91d9eba3fd6a3a2e671756ac8264a874434c
- **[api]** Se agrego funcionalidad para no requerir contraseña en modo desarrollo
- **[app]** Se agrego la solicitud de ubicacion para envio de notificaciones de acuerdo a la ubicacion !34
- **[app]** Se agrego funcionalidad para envio de notificaciones push !34
- **[app]** Se cambiaron las resoluciones de los iconos y se agregaron nuevas imagenes para los enlaces de aula virtual, web oficial y biblioteca !60
- **[app]** Se agrego spinar para la carga de imagen y error mostrando una imagen por defecto cuando existan problemas al cargar la imagen !63
- **[api]** Se cambio en encode que estaba en el api y se agrego a la vista del fotocheck !40
- **[app]** Se añadieron permisos para IOS y configuraron las versiones del build para IOS !48

**Correcciones**

- **[app]** Se corrigio bug que permitia retroceder a la ventana anterior despues de que el usuario cerraba sesion 6072368f3dd53e1c80612f889bfa45ef9aa0b49e
- **[app]** Se corrigio bug que hacia que se cierre la aplicacion !46
- **[app, api]** Se corrigio bug que hacia que no se muestre la foto en la app a veces !45
- **[app]** Se corrigio bug relacionado con el modo mantenimiento y la vista de configuracion 775cbeeaacd1dbfc99382f6327d4762085d0b180 ded58aa7b621dd9e2dd0b4e5558b563df92ebab8
- **[app]** Se corrigio el bug que no activaba el modo mantenimiento si el usuario dejaba en 'background' el app !41
- **[app]** Se corrigio la carga de la foto en el fotocheck c67a9ba9a1455a1ab28b2918a6a9f93fa7dd5bcc
- **[app]** Se removieron todos los throw error para evitar bloqueos en la app a4bc97cfd9a43b9df7c62a7e666dd336059f0697
- **[app]** Se corrigio el redireccionamiento del walktrhought usando backhandler ac5a0461bb8c9b848c74b9ebc692370a2ae3c646

## 1.4.2

[Todos los commits](https://gitlab.com/senati/senati-movil/compare/v1.4.1...v1.4.2)

**Mejoras**

- **[app]** Se agrego funcionalidad para ver el fotocheck !23
- **[api]** Se agrego endpoint '[GET] /student/card' obtener los datos del fotocheck de un alumno. b56e91d9eba3fd6a3a2e671756ac8264a874434c
- **[api]** Se agrego endpoint '[GET] /student/card/photo/{toke}' obtener la foto del alumno. b56e91d9eba3fd6a3a2e671756ac8264a874434c
- **[api]** Se agrego funcionalidad para no requerir contraseña en modo desarrollo
- **[doc]** Se agrego el archivo changelog !26 !29 !31
- **[app]** Se agrego la validacion de espacion en blanco en el login !30

**Correcciones**

- **[app]** Se corrigio el issue #47 en el commit 4f00b542

## 1.4.1

[Todos los commits](https://gitlab.com/senati/senati-movil/compare/v1.4.0...v1.4.1)

**Mejoras**

- **[app]** Se agregaro un boton de retroceso en el SINFO y se vinculo con el boton nativo de android !20
- **[app]** Se agrego boton de regresar al home en la pantalla de error !20 4aa2a3fb

**Correcciones**

- **[app]** Se corrigio la falla que hacia que se muestren mensajes de error en la vista de sinfo !21
- **[app]** Correccion de warning en el login !28
- **[app]** Se desahabilito apt2 !20 41f3a047
- **[app]** Correccion de alineamiento de imagenes en el walktrought !20 ebeb794a
- **[app]** Se redujo el tamaño de las imagenes !20 e971a7d8

## 1.4.0

[Todos los commits](https://gitlab.com/senati/senati-movil/compare/v1.3.2...v1.4.0)

**Mejoras**

- **[app]** Reordenacion de iconos en el home !16
- **[app]** Se agrego la opcion de mostrar un mensaje de "servicio en mantenimiento" con configuracion remota !17
- **[app]** Se añadió la integración con Firebase analytics !16
- **[app]** Se añadió un walkthrough de la funcionalidades !6 !12
- **[app]** Se agregó la implementación en ios y android de la vista principal de ver cursos y notas !3
- **[api]** Se agregó los endpoints para la vista Principal de cursos y notas !2
- **[app]** Se agrego el background mundialista !19
- **[app]** Se actualizó en android el nivel api de 22 a 26 (SDK) !18 628c7c50
- **[api]** Se actualizó el api a la versión 1.4.0 !19
- **[app]** Se agrego una pantalla de carga en el SINFO !5

**Correcciones**

- **[app]** Correcion de mensaje de error en la opcion SINFO !5
- **[api]** Correcion de una falla que no permitia iniciar sesion #24 !11
- **[api]** Correcion de mesaje incorrecto cuando el ID no existe !11
- **[api]** Correcion de error que no permitia inicio en SINFO - [GET]account/ssb !4
- **[docker]** Se cambió la arquitectura docker-compose c545b39c

## 1.3.2

- **[app, api, nginx, docker]** Se integro senati-app-client, senati-app-landing, senati-api-server en un solo proyecto !1
