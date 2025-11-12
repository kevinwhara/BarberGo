'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/api-libs";
import Link from "next/link";
import Image from "next/image";
import BarberGo from "@/images/Barber Go Logo.svg"
import { saveUserSession } from "@/lib/session";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const logInHandler = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !data) {
      setErrorMsg("Email tidak ditemukan!");
      return;
    }

    if (data.password !== password) {
      setErrorMsg("Password salah!");
      return;
    }

    saveUserSession(data.name, data.role)

    // localStorage.setItem("user", JSON.stringify(data.name));
    // localStorage.setItem("role", JSON.stringify(data.role));

    if (data.role === "admin") {
      router.push("/admin");
    } else {
      router.push("/user");
    }
  };

  return (
    <section className="h-screen flex justify-center items-center">
      <form
        onSubmit={logInHandler}
        className="flex flex-col border p-10 gap-5 md:w-[400px] w-[330px] rounded-xl bg-white shadow-lg"
      >
        <Image src={BarberGo} alt={"Barber Go"} />
        <h1 className="text-2xl font-bold text-center">Log In</h1>
        <p className="text-center text-gray-600">
          Enter your credentials to continue
        </p>

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="p-2 border rounded w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="p-2 border rounded w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {errorMsg && (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          className="p-2 border rounded w-full cursor-pointer bg-blue-500 hover:bg-blue-600 text-white transition"
        >
          Log In
        </button>

        <div className="flex justify-center gap-2 text-sm">
          <span>Don't have an account?</span>
          <Link href="/registration" className="text-blue-700 font-medium">
            Click here!
          </Link>
        </div>
      </form>
    </section>
  );
};

export default LoginPage;
