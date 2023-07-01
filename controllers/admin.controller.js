const pool = require("../config/db");
const bcrypt = require('bcrypt');

const addAdmin = async (req, res) => {
  try {
    const {
      admin_name,
      admin_phone_number,
      admin_password
    } = req.body;

    const hashedPassword = await bcrypt.hash(admin_password, 10);

    const query = `
    INSERT INTO admin (
        admin_name,
        admin_phone_number,
        admin_hashed_password
        ) values ($1, $2, $3) RETURNING *;
    `;

    const values = [
        admin_name,
        admin_phone_number,
        hashedPassword
    ];

    const newAdmin = await pool.query(query, values);

    res.status(200).json(newAdmin.rows);
  } catch (error) {
    res.status(500).json("Serverda xatolik");
    console.log(error);
  }
};

const getAllAdmins = async (req, res) => {
    try {
        const query = `SELECT * FROM public.admin
                        ORDER BY id ASC
        `;

        const admins = await pool.query(query);

        if (admins.rowCount == 0) return res.status(401).send({message: "Admins not found"});
        
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
    
        if (admin.rowCount == 0) return res.status(404).send({message: "Admin not found"});
    
        res.status(200).json(admin.rows[0]);
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
    }
}

const updateAdmin = async (req, res) => {
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

        const newAdmin = await pool.query(query, values);

        if (newAdmin.rowCount == 0) return res.status(200).json({message: "Admin not found"});

        res.status(200).json({message: newAdmin.rows[0]});
      } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);
      }
}

const deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id;
    
        if (isNaN(id)){
            return res.status(404).send({message: "Invalid Id"});
        }

        const query = `DELETE FROM admin
        WHERE id = $1 RETURNING *;
        `;

        const removedAdmin = await pool.query(query, [id]);

        if (removedAdmin.rowCount == 0) return res.status(200).json({message: "Admin not found"});
        
        res.status(200).send({message: `Removed admin id: ${removedAdmin.rows[0].id}`});
    } catch (error) {
        res.status(500).json("Serverda xatolik");
        console.log(error);  
    }
}

module.exports = {
    addAdmin,
    getAllAdmins,
    getadminById,
    updateAdmin,
    deleteAdmin
}