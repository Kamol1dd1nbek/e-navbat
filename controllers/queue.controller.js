const pool = require("../config/db");

const addQueue = async (req, res) => {
  try {
    const {
      spec_service_id,
      client_id,
      queue_date_time,
      queue_number
    } = req.body;

    const query = `
    INSERT INTO queue (
        spec_service_id,
        client_id,
        queue_date_time,
        queue_number
        ) values ($1, $2, $3, $4) RETURNING *;
    `;

    const values = [
        spec_service_id,
        client_id,
        queue_date_time,
        queue_number
    ];

    const newQueue = await pool.query(query, values);

    res.status(200).json(newQueue.rows[0]);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};

const getAllQueues = async (req, res) => {
    try {
        const query = `SELECT * FROM public.admin
                        ORDER BY id ASC
        `;

        const admins = await pool.query(query);

        if (admins.rowCount == 0) return res.status(401).send({message: "Queues not found"});
        
        res.status(200).json(admins.rows);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
    }
}

const getadminById = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }
    
        const query = `SELECT * FROM admin WHERE id = $1`;
    
        const admin = await pool.query(query, [id]);
    
        if (admin.rowCount == 0) return res.status(404).send({message: "Queue not found"});
    
        res.status(200).json(admin.rows[0]);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
    }
}

const updateQueue = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }

        const {
            admin_name,
            admin_phone_number,
            admin_password,
            admin_is_active,
            admin_is_creator
        } = req.body;
    
        const query = `
        UPDATE admin
            SET
            admin_name = $1,
            admin_phone_number = $2,
            admin_hashed_password = $3,
            admin_is_active = $4,
            admin_is_creator = $5
            WHERE id = $6 RETURNING *;
        `;

        const hashedPassword = await bcrypt.hash(admin_password, 10);

        const values = [
            admin_name,
            admin_phone_number,
            hashedPassword,
            admin_is_active,
            admin_is_creator,
            id
        ];

        const newQueue = await pool.query(query, values);

        if (newQueue.rowCount == 0) return res.status(200).json({message: "Queue not found"});

        res.status(200).json({message: newQueue.rows[0]});
      } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
      }
}

const deleteQueue = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }

        const query = `DELETE FROM admin
        WHERE id = $1 RETURNING *;
        `;

        const removedQueue = await pool.query(query, [id]);

        if (removedQueue.rowCount == 0) return res.status(200).json({message: "Queue not found"});
        
        res.status(200).send({message: `Removed admin id: ${removedQueue.rows[0].id}`});
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);  
    }
}

module.exports = {
    addQueue,
    getAllQueues,
    getadminById,
    updateQueue,
    deleteQueue
}