import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button.js";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  args: {
    children: "Save",
    variant: "primary",
    size: "md",
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Cancel",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Delete",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Create Budget",
  },
};
