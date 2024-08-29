const SensorInfo = require('../models/SensorInfo');
const { Op } = require('sequelize');

// Lấy danh sách tất cả dữ liệu của bảng sensor_info
exports.getSensorInfoList = async (req, res) => {
    try {
        const sensorInfoList = await SensorInfo.findAll();
        res.status(200).json(sensorInfoList);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách sensor_info:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};

exports.addSensorInfo = async (req, res) => {
    try {
        const { sensor_name, sensor_type, unit, max_value, min_value, noise_factor } = req.body;

        // Check if the sensor already exists
        const existingSensor = await SensorInfo.findOne({ where: { sensor_name } });
        if (existingSensor) {
            return res.status(400).json({ error: 'Cảm biến đã tồn tại' });
        }

        // Check if the unit is appropriate for the sensor type
        const sensorTypeUnits = {
            'Nhiệt độ': 'Celsius',
            'Độ ẩm': '%',
            'Áp suất': 'Pa',
            'Ánh sáng': 'Lux',
        };

        if (!sensorTypeUnits[sensor_type] || unit !== sensorTypeUnits[sensor_type]) {
            return res.status(400).json({ error: 'Đơn vị không phù hợp với loại cảm biến' });
        }

        // Check if max_value is greater than or equal to min_value
        if (max_value < min_value) {
            return res.status(400).json({ error: 'Giá trị tối đa phải lớn hơn hoặc bằng giá trị tối thiểu' });
        }

        // Create and save new sensor info
        const newSensor = await SensorInfo.create({
            sensor_name,
            sensor_type,
            unit,
            max_value,
            min_value,
            noise_factor,
        });

        res.status(201).json({ message: 'Thêm cảm biến thành công', sensor: newSensor });
    } catch (error) {
        console.error('Lỗi khi thêm cảm biến:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// Cập nhật thông tin cảm biến
exports.updateSensorInfo = async (req, res) => {
    try {
        const { id } = req.params;
        const { sensor_name, sensor_type, unit, max_value, min_value, noise_factor } = req.body;

        // Kiểm tra xem cảm biến có tồn tại không
        const sensor = await SensorInfo.findByPk(id);
        if (!sensor) {
            return res.status(404).json({ error: 'Cảm biến không tìm thấy' });
        }

        // Kiểm tra xem tên cảm biến có bị trùng không
        const existingSensor = await SensorInfo.findOne({
            where: {
                sensor_name,
                id: {
                    [Op.ne]: id // Bỏ qua cảm biến hiện tại
                }
            }
        });
        if (existingSensor) {
            return res.status(400).json({ error: 'Cảm biến với tên này đã tồn tại' });
        }

        // Kiểm tra xem đơn vị có phù hợp với loại cảm biến không
        const sensorTypeUnits = {
            'Nhiệt độ': 'Celsius',
            'Độ ẩm': '%',
            'Áp suất': 'Pa',
            'Ánh sáng': 'Lux'
        };

        if (sensorTypeUnits[sensor_type] !== unit) {
            return res.status(400).json({ error: 'Đơn vị không phù hợp với loại cảm biến' });
        }

        // Cập nhật thông tin cảm biến
        sensor.sensor_name = sensor_name;
        sensor.sensor_type = sensor_type;
        sensor.unit = unit;
        sensor.max_value = max_value;
        sensor.min_value = min_value;
        sensor.noise_factor = noise_factor;
        await sensor.save();

        res.status(200).json({ message: 'Thông tin cảm biến đã được cập nhật thành công', sensor });
    } catch (error) {
        console.error('Lỗi khi cập nhật thông tin cảm biến:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};
// Xóa thông tin cảm biến
exports.deleteSensorInfo = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem cảm biến có tồn tại không
        const sensor = await SensorInfo.findByPk(id);
        if (!sensor) {
            return res.status(404).json({ error: 'Cảm biến không được tìm thấy' });
        }

        // Xóa cảm biến
        await SensorInfo.destroy({
            where: { id }
        });

        res.status(200).json({ message: 'Cảm biến đã được xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa cảm biến:', error);
        res.status(500).json({ error: 'Lỗi máy chủ nội bộ' });
    }
};