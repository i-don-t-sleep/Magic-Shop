"use client"

import React from "react";
import {Tabs, Tab, Input, Link, Button, Card, CardBody} from "@heroui/react";

export default function TabsWithForm() {
  const [selected, setSelected] = React.useState("login");

  return (
    <div className="flex flex-col w-full bg-[#0A0A0A] min-h-screen items-center justify-center p-6">
      <Card className="max-w-full w-[340px] h-[400px] bg-[#161616] shadow-xl border-[#FF0000]/20 border">
        <CardBody className="overflow-hidden">
          <Tabs
            fullWidth
            aria-label="Tabs form"
            selectedKey={selected}
            size="md"
            onSelectionChange={setSelected}
            classNames={{
              tabList: "bg-[#202020] rounded-lg p-1",
              cursor: "bg-[#FF0000]/80",
              tab: "text-white/60 data-[selected=true]:text-white",
            }}
          >
            <Tab key="login" title="Login">
              <form className="flex flex-col gap-4 mt-6">
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  classNames={{
                    label: "text-white/90",
                    input: "bg-[#202020] text-white border-[#FF0000]/20",
                  }}
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  classNames={{
                    label: "text-white/90",
                    input: "bg-[#202020] text-white border-[#FF0000]/20",
                  }}
                />
                <p className="text-center text-small text-white/60">
                  Need to create an account?{" "}
                  <Link 
                    size="sm" 
                    onPress={() => setSelected("sign-up")}
                    className="text-[#FF0000] hover:text-[#FF2626]"
                  >
                    Sign up
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button 
                    fullWidth 
                    className="bg-[#FF0000] text-white hover:bg-[#CC0000] transition-colors"
                  >
                    Login
                  </Button>
                </div>
              </form>
            </Tab>
            <Tab key="sign-up" title="Sign up">
              <form className="flex flex-col gap-4 mt-6">
                <Input
                  isRequired
                  label="Name"
                  placeholder="Enter your name"
                  type="text"
                  classNames={{
                    label: "text-white/90",
                    input: "bg-[#202020] text-white border-[#FF0000]/20",
                  }}
                />
                <Input
                  isRequired
                  label="Email"
                  placeholder="Enter your email"
                  type="email"
                  classNames={{
                    label: "text-white/90",
                    input: "bg-[#202020] text-white border-[#FF0000]/20",
                  }}
                />
                <Input
                  isRequired
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  classNames={{
                    label: "text-white/90",
                    input: "bg-[#202020] text-white border-[#FF0000]/20",
                  }}
                />
                <p className="text-center text-small text-white/60">
                  Already have an account?{" "}
                  <Link 
                    size="sm" 
                    onPress={() => setSelected("login")}
                    className="text-[#FF0000] hover:text-[#FF2626]"
                  >
                    Login
                  </Link>
                </p>
                <div className="flex gap-2 justify-end">
                  <Button 
                    fullWidth 
                    className="bg-[#FF0000] text-white hover:bg-[#CC0000] transition-colors"
                  >
                    Sign up
                  </Button>
                </div>
              </form>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}