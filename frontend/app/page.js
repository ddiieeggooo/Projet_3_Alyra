'use client'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { abi, contractAddress } from '@/constants';

import { useAccount } from 'wagmi'
import { readContract, prepareWriteContract, writeContract } from '@wagmi/core'

import { useState } from 'react';

import Link from "next/link";

export default function Home() {
  return (
    <nav>
      <Link href="/">Acceuil</Link>
      <Link href="/proposals">Proposals</Link>
      <Link href="/vote">Vote</Link>
    </nav>
  );
}
