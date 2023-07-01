const pool = require("../config/db");

const addClient = async (req, res) => {
  try {
    const {
      client_last_name,
      client_first_name,
      client_phone_number,
      client_info,
      client_photo
    } = req.body;

    const query = `
    INSERT INTO client (
            client_last_name,
            client_first_name,
            client_phone_number,
            client_info,
            client_photo
        ) values ($1, $2, $3, $4, $5) RETURNING *;
    `;

    const values = [
        client_last_name,
        client_first_name,
        client_phone_number,
        client_info,
        client_photo,

    ];

    const newClient = await pool.query(query, values);

    res.status(200).json(newClient.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};

const getAllClients = async (req, res) => {
    try {
        const query = `SELECT * FROM public.client
                        ORDER BY id ASC
        `;

        const clients = await pool.query(query);

        if (clients.rowCount == 0) return res.status(401).send({message: "Clients not found"});
        
        res.status(200).json(clients.rows);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
    }
}

const getClientById = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }
    
        const query = `SELECT * FROM CLIENT WHERE id = $1`;
    
        const client = await pool.query(query, [id]);
    
        if (client.rowCount == 0) return res.status(404).send({message: "Client not found"});
    
        res.status(200).json(client.rows[0]);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
    }
}

const updateClient = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }

        const data = {
          client_last_name,
          client_first_name,
          client_phone_number,
          client_info,
          client_photo
        } = req.body;
    
        const query = `
        UPDATE client
            SET
            client_last_name = $1,
            client_first_name = $2,
            client_phone_number = $3,
            client_info = $4,
            client_photo = $5 
            WHERE id = $6 RETURNING *;
        `;

        const values = [
            client_last_name,
            client_first_name,
            client_phone_number,
            client_info,
            client_photo,
            id
        ];

        const newClient = await pool.query(query, values);

        if (newClient.rowCount == 0) return res.status(200).json({message: "Client not found"});

        res.status(200).json({message: newClient.rows});
      } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
      }
}

const deleteClient = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }

        const query = `DELETE FROM client
        WHERE id = $1 RETURNING *;
        `;

        const removedClient = await pool.query(query, [id]);

        if (removedClient.rowCount == 0) return res.status(200).json({message: "Client not found"});
        
        res.status(200).send({message: `Removed client id: ${removedClient.rows[0].id}`});
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);  
    }
}

module.exports = {
    addClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
}