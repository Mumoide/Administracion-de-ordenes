INSERT INTO ordenes_de_trabajo (
                fecha_creacion,
                numero_ficha,
                rut_paciente,
                centro,
                rut_doctor,
                tipo_trabajo,
                protesis,
                completitud,
                color,
                ubicacion,
                indicaciones,
                tipo_factura,
                fecha_facturacion,
                licencia
            ) VALUES ?;
            
INSERT INTO personas (rut, nombre, apellido, fecha_nacimiento, rol_id) VALUES ?;            