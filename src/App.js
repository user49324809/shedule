import React, { useState, useMemo } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Container,
  Box,
  TextField,
  Divider,
  Button,
  Switch,
  FormControlLabel,
  CssBaseline,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
//Данные врачей
const doctorsBySpeciality = {
  Терапевт: [
    {
      name: "Иванов Иван Иванович",
      time: "09:00 - 15:00",
      office: "Каб. 101",
      speciality: "Терапевт",
    },
    {
      name: "Петрова Анна Сергеевна",
      time: "10:00 - 16:00",
      office: "Каб. 102",
      speciality: "Терапевт",
    },
  ],
  Невролог: [
    {
      name: "Кузнецова Мария Викторовна",
      time: "08:30 - 14:30",
      office: "Каб. 301",
      speciality: "Невролог",
    },
    {
      name: "Петров Иван Дмитриевич",
      time: "08:30 - 14:30",
      office: "Каб. 301",
      speciality: "Невролог",
    },
  ],
  Окулист: [
    {
      name: "Иванова Марья Ивановна",
      time: "09:30 - 12:40",
      office: "Каб. 204",
      speciality: "Окулист",
    },
    {
      name: "Сидоров Сидор Иванович",
      time: "14:30 - 17:40",
      office: "Каб. 204",
      speciality: "Окулист",
    },
  ],
  Психотерапевт: [
    {
      name: "Долгова Оксана Сергеевна",
      time: "09:30 - 12:40",
      office: "Каб. 204",
      speciality: "Психотерапевт",
    },
    {
      name: "Петров Олег Сергеевич",
      time: "12:30 - 15:40",
      office: "Каб. 204",
      speciality: "Психотерапевт",
    },
  ],
};
//Сортировка по фамилии
const sortByLastName = (doctors) => {
  return [...doctors].sort((a, b) => {
    const lastNameA = a.name.split(" ")[0].toLowerCase();
    const lastNameB = b.name.split(" ")[0].toLowerCase();
    return lastNameA.localeCompare(lastNameB);
  });
};
//Карточки врачей
const DoctorCard = ({ doctor }) => (
  <Card variant="outlined" sx={{ mb: 2 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {doctor.name}
      </Typography>
      <Typography variant="body2">🕒 {doctor.time}</Typography>
      <Typography variant="body2">🏢 {doctor.office}</Typography>
      <Typography variant="body2">📌 {doctor.speciality}</Typography>
    </CardContent>
  </Card>
);
const DoctorsBySpeciality = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [selectedSpeciality, setSelectedSpeciality] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    message: "",
  });
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#90caf9" : "#1976d2",
          },
        },
      }),
    [darkMode]
  );
  const filteredDoctors = useMemo(() => {
    const result = Object.entries(doctorsBySpeciality).reduce(
      (acc, [speciality, docs]) => {
        const matched = docs.filter((doc) =>
          doc.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matched.length) acc[speciality] = sortByLastName(matched);
        return acc;
      },
      {}
    );
    return result;
  }, [searchTerm]);
  const handleResetSearch = () => setSearchTerm("");
  const handleToggleTheme = () => setDarkMode((prev) => !prev);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSpeciality) {
      alert("Пожалуйста, выберите специальность");
      return;
    }
    try {
      const response = await axios.post("http://localhost:5000/api/submit", {
        ...formData,
        speciality: selectedSpeciality,
      });
      console.log("Данные отправлены:", response.data);
      alert("Запись успешно отправлена!");
      // Очистка формы
      setFormData({
        name: "",
        phone: "",
        email: "",
        password: "",
        message: "",
      });
      setSelectedSpeciality("");
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      alert("Ошибка при отправке формы");
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4">Список врачей по специальностям</Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={handleToggleTheme} />}
            label="Тёмная тема"
          />
        </Box>
        <TextField
          fullWidth
          label="Поиск по ФИО врача"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleResetSearch}
          disabled={!searchTerm}
          sx={{ mb: 4 }}
        >
          Показать всех
        </Button>
        {Object.keys(filteredDoctors).length === 0 ? (
          <Typography>Врачей не найдено.</Typography>
        ) : (
          Object.entries(filteredDoctors).map(([speciality, docs]) => (
            <Box key={speciality} mb={4}>
              <Typography variant="h5" sx={{ mb: 1, color: "primary.main" }}>
                {speciality}
              </Typography>
              <Divider sx={{ mb: 2 }} />
              {docs.map((doc) => (
                <DoctorCard key={doc.name} doctor={doc} />
              ))}
            </Box>
          ))
        )}
        <form onSubmit={handleSubmit}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Запись на приём
          </Typography>
          <TextField
            fullWidth
            label="ФИО"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          />
          <TextField
            fullWidth
            label="Телефон"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            sx={{ mb: 2 }}
            type="tel"
            required
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
            type="email"
            required
          />
          <TextField
            fullWidth
            label="Пароль"
            name="password"
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
            type="password"
            required
          />
          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel id="speciality-label">Специальность</InputLabel>
            <Select
              labelId="speciality-label"
              value={selectedSpeciality}
              label="Специальность"
              onChange={(e) => setSelectedSpeciality(e.target.value)}
            >
              <MenuItem value="">
                <em>Выберите специальность</em>
              </MenuItem>
              {Object.keys(doctorsBySpeciality).map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Сообщение"
            name="message"
            value={formData.message}
            onChange={handleChange}
            multiline
            rows={4}
            sx={{ mb: 3 }}
          />
          <Button variant="contained" type="submit" fullWidth>
            Записаться
          </Button>
        </form>
      </Container>
    </ThemeProvider>
  );
};
export default DoctorsBySpeciality;


