import * as React from "react";
import { Buffer } from 'buffer';
export interface MirPayBluetooth {
    connect: () => void;
    isConnected: boolean;
    processTransaction: () => void;
    transactionData: string;
}

export const useMirPayBluetooth = (): MirPayBluetooth => {
    const [isConnected, setIsConnected] = React.useState(false);
    const [transactionData, setTransactionData] = React.useState("");
    const [transactionCharacteristic, setTransactionCharacteristic] =
        React.useState<BluetoothRemoteGATTCharacteristic | null>(null);
    const [startTransactionCharacteristic, setStartTransactionCharacteristic] =
        React.useState<BluetoothRemoteGATTCharacteristic | null>(null);

    const connect = async () => {
        const devices = await navigator.bluetooth.getDevices()
        console.log("Devices: " + devices)
        const device = await navigator.bluetooth.requestDevice({
            filters: [
                {
                    services: [ '168952de-c604-4401-881e-989996888365' ]
                },
            ],
            // Philips Hue Light Control Service
            optionalServices: ["168952de-c604-4401-881e-989996888365"],
        });
        const server = await device.gatt?.connect();

        // Philips Hue Light Control Service
        const service = await server?.getPrimaryService(
            "168952de-c604-4401-881e-989996888365"
        );

        const getTransactionCharacteristic = await service?.getCharacteristic(
            "268952de-c604-4401-881e-989996888366"
        );

        const startTransactionCharacteristic = await service?.getCharacteristic(
            "368952de-c604-4401-881e-989996888367"
        );

        setTransactionCharacteristic(getTransactionCharacteristic!);
        setStartTransactionCharacteristic(startTransactionCharacteristic!);

        setIsConnected(true);
    };

    const processTransaction = async () => {
        const currentValue = await transactionCharacteristic?.readValue();
        const trData = new TextDecoder().decode(currentValue?.buffer)
        console.log(trData);
        const trDataJson = JSON.parse(trData);

        setTransactionData(trDataJson["shop"] + ' ' + trDataJson["amount"]);

        const data = new TextEncoder().encode("{operation: \"cancelTransaction\"}");
        await startTransactionCharacteristic?.writeValue(
            data
        );
    };

    return { connect, processTransaction, isConnected, transactionData };
};