import { icons } from "@/constants/icons";
import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { supabase } from "../../lib/supabase";

const TabIcon = ({ focused, source }: { focused: boolean; source: any }) => {
  return (
    <View className="items-center justify-center">
      <Image
        source={source}
        tintColor={focused ? "#ffffff" : "#9ca3af"}
        resizeMode="contain"
        className="w-6 h-6"
      />
    </View>
  );
};

export default function Layout() {
  const [userRole, setUserRole] = useState<"cleaner" | "owner" | null>(null);

  useEffect(() => {
    checkUserRole();
  }, []);

  const checkUserRole = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setUserRole(data.role);
    } catch (error) {
      console.error("Error checking user role:", error);
    }
  };

  return (
    <Tabs
      initialRouteName="home"
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1f2937",
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          marginBottom: 16,
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.home} />
          ),
        }}
      />

      {userRole === "cleaner" ? (
        <Tabs.Screen
          name="opportunity"
          options={{
            title: "Opportunities",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} source={icons.chat} />
            ),
          }}
        />
      ) : (
        <Tabs.Screen
          name="launch"
          options={{
            title: "Post Task",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} source={icons.chat} />
            ),
          }}
        />
      )}

      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.list} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} source={icons.profile} />
          ),
        }}
      />
    </Tabs>
  );
}
