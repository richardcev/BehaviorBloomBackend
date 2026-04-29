const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Swagger imports
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const recruitmentRoutes = require('./routes/recruitmentRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// RUTA DE LA DOCUMENTACIÓN (OPENAPI / SWAGGER)
// ==========================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas normales
app.use('/api/auth', authRoutes);
app.use('/api/recruitment', recruitmentRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📄 Documentación disponible en: http://localhost:${PORT}/api-docs`); // <-- Mensajito útil
  
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada.');
  } catch (error) {
    console.error('❌ Error con la BD:', error);
  }
});
