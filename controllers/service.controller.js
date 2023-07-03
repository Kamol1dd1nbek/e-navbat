const pool = require("../config/db");

const addService = async (req, res) => {
  try {
    const {
      service_name,
      service_price
    } = req.body;

    const query = `
    INSERT INTO service (
        service_name,
        service_price
        ) values ($1, $2) RETURNING *;
    `;

    const values = [
        service_name,
        service_price
    ];

    const newService = await pool.query(query, values);

    res.status(200).json(newService.rows[0]);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};

const getAllServices = async (req, res) => {
    try {
        const query = `SELECT * FROM public.service
                        ORDER BY id ASC
        `;

        const services = await pool.query(query);

        if (services.rowCount == 0) return res.status(401).send({message: "Services not found"});
        
        res.status(200).json(services.rows);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
    }
}

const getServiceById = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }
    
        const query = `SELECT * FROM service WHERE id = $1`;
    
        const service = await pool.query(query, [id]);
    
        if (service.rowCount == 0) return res.status(404).send({message: "Service not found"});
    
        res.status(200).json(service.rows[0]);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
    }
}

const updateService = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }

        const {
            service_name,
            service_price
        } = req.body;
    
        const query = `
        UPDATE service
            SET
            service_name = $1,
            service_price = $2
            WHERE id = $3 RETURNING *;
        `;

        const values = [
            service_name,
            service_price,
            id
        ];

        const newService = await pool.query(query, values);

        if (newService.rowCount == 0) return res.status(200).json({message: "Service not found"});

        res.status(200).json(newService.rows[0]);
      } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
      }
}

const deleteService = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }

        const query = `DELETE FROM service
        WHERE id = $1 RETURNING *;
        `;

        const removedService = await pool.query(query, [id]);

        if (removedService.rowCount == 0) return res.status(200).json({message: "Service not found"});
        
        res.status(200).send({message: `Removed service id: ${removedService.rows[0].id}`});
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);  
    }
}

module.exports = {
    addService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
}