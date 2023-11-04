import { ScrollView, StyleSheet, View } from "react-native";
import ScreenTemplate from "../components/ScreenTemplate";
import CustomInput from "../components/CustomInput";
import CustomButton from "../components/CustomButton";
import { useContext, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackNavigationType } from "../routers/AuthRouter";
import { PopupContext } from "../contexts/PopupContext";
import { backendApi } from "../configs/Api";
import {
  CheckEmailType,
  CheckUserType,
  SignUpType,
} from "../types/ApiResponses/AuthenticationTypes";
import { AuthContext } from "../contexts/AuthContext";

export type RegisterFormType = {
  username: string;
  name: string;
  lastName: string;
  password: string;
  passwordVerify: string;
  email: string;
};

interface RegisterProps {
  navigation: StackNavigationProp<AuthStackNavigationType>;
}

export default function Register({ navigation }: RegisterProps) {
  const { openAlertPopup } = useContext(PopupContext);
  const { login } = useContext(AuthContext);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [registerForm, setRegisterForm] = useState<RegisterFormType>({
    username: "",
    name: "",
    lastName: "",
    password: "",
    passwordVerify: "",
    email: "",
  });

  async function handleRegister() {
    try {
      setLoadingRegister(true);
      const validationResponse = await validateFields();
      if (validationResponse.ok === false) {
        openAlertPopup({ content: validationResponse.message });
        return false;
      }
      const signUpReponse = await signUp();
      if (signUpReponse.ok === false) {
        openAlertPopup({ content: signUpReponse.message });
        return false;
      }
      const loginResponse = await login({
        username: registerForm.username,
        password: registerForm.password,
      });
      if (loginResponse.ok === false) {
        openAlertPopup({
          title: "Sucesso",
          content:
            "Sua conta foi criada com sucesso. Realize o login para desfrutar das funcionalidades do nosso app",
          buttonText: "Fazer login",
          buttonFunction: () => {
            navigation.navigate("Login");
          },
        });
      }
    } catch (error: any) {
      openAlertPopup({
        content:
          "Ocorreu um erro inesperado, por favor tente novamente mais tarde.",
      });
    } finally {
      setLoadingRegister(false);
    }
  }

  async function signUp() {
    try {
      await backendApi.post<SignUpType>("/authentication/signup", {
        username: registerForm.username,
        name: registerForm.name,
        lastName: registerForm.lastName,
        password: registerForm.password,
        email: registerForm.email,
      });
      return { ok: true, message: "" };
    } catch (error: any) {
      return {
        ok: false,
        message:
          "Não foi possível realizar o cadastro. Tente novamente mais tarde",
      };
    }
  }

  async function validateFields(): Promise<{ ok: boolean; message: string }> {
    const fieldValues = Object.values(registerForm).map((value) =>
      value.trim()
    );
    if (fieldValues.includes("")) {
      return {
        ok: false,
        message: "Por favor, informe todos os campos para realizar o cadastro.",
      };
    }
    if (registerForm.password.trim().length < 8) {
      return {
        ok: false,
        message: "A senha deve conter no minimo 8 caracteres",
      };
    }
    if (registerForm.password !== registerForm.passwordVerify) {
      return { ok: false, message: "As senhas digitadas não se coincidem." };
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(registerForm.email)) {
      return { ok: false, message: "Por favor, informe um email válido." };
    }
    if (!(await verifyEmailDisponibility())) {
      return {
        ok: false,
        message: "O email informado já está sendo utilizado.",
      };
    }
    if (!(await verifyUserDisponibility())) {
      return {
        ok: false,
        message: "O usuário informado já está sendo utilizado.",
      };
    }
    return { ok: true, message: "" };
  }

  async function verifyEmailDisponibility() {
    try {
      const response = await backendApi.post<CheckEmailType>(
        "/authentication/checkEmail",
        {
          email: registerForm.email,
        }
      );
      const { isAvailable } = response.data;
      return isAvailable;
    } catch (error: any) {
      return false;
    }
  }

  async function verifyUserDisponibility() {
    try {
      const response = await backendApi.post<CheckUserType>(
        "/authentication/checkUser",
        {
          username: registerForm.username,
        }
      );
      const { isAvailable } = response.data;
      return isAvailable;
    } catch (error: any) {
      return false;
    }
  }

  return (
    <ScreenTemplate>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <CustomInput.Container>
          <CustomInput.Icon iconName="person" />
          <CustomInput.Input
            placeholder="Usuário"
            value={registerForm.username}
            onChangeText={(text) =>
              setRegisterForm((prevState) => {
                return {
                  ...prevState,
                  username: text,
                };
              })
            }
          />
        </CustomInput.Container>
        <CustomInput.Container>
          <CustomInput.Icon iconName="badge" />
          <CustomInput.Input
            placeholder="Nome"
            value={registerForm.name}
            onChangeText={(text) =>
              setRegisterForm((prevState) => {
                return {
                  ...prevState,
                  name: text,
                };
              })
            }
          />
        </CustomInput.Container>
        <CustomInput.Container>
          <CustomInput.Icon iconName="face" />
          <CustomInput.Input
            placeholder="Sobrenome"
            value={registerForm.lastName}
            onChangeText={(text) =>
              setRegisterForm((prevState) => {
                return {
                  ...prevState,
                  lastName: text,
                };
              })
            }
          />
        </CustomInput.Container>
        <CustomInput.Container>
          <CustomInput.Icon iconName="lock" />
          <CustomInput.Input
            placeholder="Senha"
            value={registerForm.password}
            secureTextEntry={true}
            onChangeText={(text) =>
              setRegisterForm((prevState) => {
                return {
                  ...prevState,
                  password: text,
                };
              })
            }
          />
        </CustomInput.Container>
        <CustomInput.Container>
          <CustomInput.Icon iconName="done" />
          <CustomInput.Input
            placeholder="Confirme a Senha"
            secureTextEntry={true}
            value={registerForm.passwordVerify}
            onChangeText={(text) =>
              setRegisterForm((prevState) => {
                return {
                  ...prevState,
                  passwordVerify: text,
                };
              })
            }
          />
        </CustomInput.Container>
        <CustomInput.Container>
          <CustomInput.Icon iconName="mail" />
          <CustomInput.Input
            placeholder="Email"
            keyboardType="email-address"
            value={registerForm.email}
            autoCapitalize="none"
            onChangeText={(text) =>
              setRegisterForm((prevState) => {
                return {
                  ...prevState,
                  email: text,
                };
              })
            }
          />
        </CustomInput.Container>
        <View style={styles.buttonsContainer}>
          <CustomButton
            text="Cadastrar"
            onPress={handleRegister}
            loading={loadingRegister}
          />
          <CustomButton
            text="Fazer login"
            isOutline={true}
            onPress={() => navigation.navigate("Login")}
          />
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
    alignItems: "center",
    justifyContent: "space-between",
    flexGrow: 1,
  },
  buttonsContainer: {
    width: "100%",
    gap: 20,
  },
});
