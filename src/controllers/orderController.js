const Table = require('../models/Table');

// @desc    Get all tables
// @route   GET /api/tables
// @access  Public/Private
exports.getTables = async (req, res) => {
    try {
        const { status } = req.query;

        let query = {};
        if (status && status !== 'all') {
            query.status = status;
        }

        const tables = await Table.find(query).sort('number');

        res.json({
            success: true,
            count: tables.length,
            data: tables
        });
    } catch (error) {
        console.error('Get tables error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch tables',
            message: error.message
        });
    }
};

// @desc    Get single table
// @route   GET /api/tables/:id
// @access  Public/Private
exports.getTable = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        res.json({
            success: true,
            data: table
        });
    } catch (error) {
        console.error('Get table error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch table',
            message: error.message
        });
    }
};

// @desc    Create new table
// @route   POST /api/tables
// @access  Private/Admin
exports.createTable = async (req, res) => {
    try {
        const { number, capacity, status = 'available', location = 'indoor' } = req.body;

        // Check if table number already exists
        const existingTable = await Table.findOne({ number });
        if (existingTable) {
            return res.status(400).json({
                success: false,
                error: `Table number ${number} already exists`
            });
        }

        // Generate QR code URL
        const qrCode = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/menu?table=${number}`;

        const table = await Table.create({
            number,
            capacity,
            status,
            location,
            qrCode
        });

        res.status(201).json({
            success: true,
            message: 'Table created successfully',
            data: table
        });
    } catch (error) {
        console.error('Create table error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create table',
            message: error.message
        });
    }
};

// @desc    Update table
// @route   PUT /api/tables/:id
// @access  Private/Admin
exports.updateTable = async (req, res) => {
    try {
        let table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        // If number is being updated, check for duplicates
        if (req.body.number && req.body.number !== table.number) {
            const existingTable = await Table.findOne({
                number: req.body.number,
                _id: { $ne: req.params.id }
            });
            if (existingTable) {
                return res.status(400).json({
                    success: false,
                    error: `Table number ${req.body.number} already exists`
                });
            }
            // Update QR code if table number changes
            req.body.qrCode = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/menu?table=${req.body.number}`;
        }

        table = await Table.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Table updated successfully',
            data: table
        });
    } catch (error) {
        console.error('Update table error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to update table',
            message: error.message
        });
    }
};

// @desc    Delete table
// @route   DELETE /api/tables/:id
// @access  Private/Admin
exports.deleteTable = async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);

        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        // Check if table is currently occupied
        if (table.status === 'occupied') {
            return res.status(400).json({
                success: false,
                error: 'Cannot delete an occupied table'
            });
        }

        await table.deleteOne();

        res.json({
            success: true,
            message: 'Table deleted successfully'
        });
    } catch (error) {
        console.error('Delete table error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to delete table',
            message: error.message
        });
    }
};

// @desc    Get table stats
// @route   GET /api/tables/stats
// @access  Private/Admin
exports.getTableStats = async (req, res) => {
    try {
        const totalTables = await Table.countDocuments();
        const availableTables = await Table.countDocuments({ status: 'available' });
        const occupiedTables = await Table.countDocuments({ status: 'occupied' });
        const reservedTables = await Table.countDocuments({ status: 'reserved' });

        res.json({
            success: true,
            data: {
                totalTables,
                availableTables,
                occupiedTables,
                reservedTables
            }
        });
    } catch (error) {
        console.error('Get table stats error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch table stats',
            message: error.message
        });
    }
};