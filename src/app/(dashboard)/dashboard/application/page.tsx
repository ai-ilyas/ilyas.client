'use client';
import { Canvas } from '@/src/components/ui/diagram';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/src/components/ui/resizable';

import { Checkbox } from '@/src/components/ui/checkbox';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@radix-ui/react-icons';

import { Tabs, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import ApplicationView from './appComponentold';
import { AppDashboard } from './AppDashboard';

///MENUBAR
type MenubarToggleProps = {
  MENU_ITEMS: string[];
  activeMenuSelectionToggle: string;
  setActiveMenuSelectionToggle: (value: string) => void;
};
export function MenubarToggle({
  MENU_ITEMS,
  activeMenuSelectionToggle,
  setActiveMenuSelectionToggle
}: MenubarToggleProps) {
  return (
    <div className=" flex items-center justify-center ">
      <div className="flex items-center justify-center divide-x rounded border">
        <Tabs defaultValue={MENU_ITEMS[1]} >
          <TabsList>
            <TabsTrigger
              key={MENU_ITEMS[0]}
              value={MENU_ITEMS[0]}
              onClick={() => setActiveMenuSelectionToggle(MENU_ITEMS[0])}
            >
              Application
            </TabsTrigger>
            <TabsTrigger
              key={MENU_ITEMS[1]}
              value={MENU_ITEMS[1]}
              onClick={() => setActiveMenuSelectionToggle(MENU_ITEMS[1])}
            >
              Both
            </TabsTrigger>
            <TabsTrigger
              key={MENU_ITEMS[2]}
              value={MENU_ITEMS[2]}
              onClick={() => setActiveMenuSelectionToggle(MENU_ITEMS[2])}
            >
              Canvas
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}

type MenubarButtonToggleProps = {
  MENU_ITEMS: string[];
  activeMenuSelectionToggle: string;
  setActiveMenuSelectionToggle: (value: string) => void;
};
export function MenubarButtonToggle({
  MENU_ITEMS,
  activeMenuSelectionToggle,
  setActiveMenuSelectionToggle
}: MenubarToggleProps) {
  return (
    <div className=" flex items-center justify-center">
      <Button
        key={MENU_ITEMS[0]}
        value={MENU_ITEMS[0]}
        variant="outline"
        Icon={ArrowLeftIcon}
        iconPlacement="left"
        onClick={() => setActiveMenuSelectionToggle(MENU_ITEMS[0])}
      >
        {MENU_ITEMS[0]}
      </Button>
      <Button
        key={MENU_ITEMS[1]}
        value={MENU_ITEMS[1]}
        variant="outline"
        onClick={() => setActiveMenuSelectionToggle(MENU_ITEMS[1])}
      >
        {MENU_ITEMS[1]}
      </Button>
      <Button
        key={MENU_ITEMS[2]}
        value={MENU_ITEMS[2]}
        variant="outline"
        Icon={ArrowRightIcon}
        iconPlacement="right"
        onClick={() => setActiveMenuSelectionToggle(MENU_ITEMS[2])}
      >
        {MENU_ITEMS[2]}
      </Button>
    </div>
  );
}

export default function Page() {
  const MENU_ITEMS: string[] = ['Application', 'Both', 'Canvas'];
  const [activeMenuSelectionToggle, setActiveMenuSelectionToggle] = useState(
    MENU_ITEMS[1]
  );
  return (
    <div className="w-full overflow-hidden">
      <MenubarToggle
        MENU_ITEMS={MENU_ITEMS}
        activeMenuSelectionToggle={activeMenuSelectionToggle}
        setActiveMenuSelectionToggle={setActiveMenuSelectionToggle}
      ></MenubarToggle>
      {activeMenuSelectionToggle === 'Application' ? (
        <div
          style={{
            height: 'calc(100vh - 3rem)'
          }}
        >
          
          <AppDashboard></AppDashboard>
        </div>
      ) : activeMenuSelectionToggle === 'Both' ? (
        <ResizablePanelGroup
          style={{
            height: 'calc(100vh - 3rem)'
          }}
          direction="horizontal"
        >
          <ResizablePanel>
            <div className="h-screen basis-1/4 border-2 border-solid">
              <AppDashboard></AppDashboard>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <div className="h-screen basis-1/4 border-2 border-solid">
              <Canvas></Canvas>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      ) : activeMenuSelectionToggle === 'Canvas' ? (
        <div
          style={{
            height: 'calc(100vh - 3rem)'
          }}
        >
          <Canvas></Canvas>
        </div>
      ) : null}
    </div>
  );
}
