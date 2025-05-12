import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Check, Wallet, X } from "lucide-react";

// Mock accounts data
const bankAccounts = [
  { id: 1, bankName: "সোনালী ব্যাংক", accountNumber: "**** **** 1234", accountHolder: "John Doe", isDefault: true },
  { id: 2, bankName: "পূবালী ব্যাংক", accountNumber: "**** **** 5678", accountHolder: "John Doe", isDefault: false },
];

const mobileWallets = [
  { id: 1, provider: "বিকাশ", number: "017********", name: "John Doe", isDefault: true },
  { id: 2, provider: "নগদ", number: "018********", name: "John Doe", isDefault: false },
];

const Accounts: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  const [newBankAccount, setNewBankAccount] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    isDefault: false,
  });
  
  const [newMobileWallet, setNewMobileWallet] = useState({
    provider: "",
    number: "",
    name: "",
    isDefault: false,
  });

  const handleAddBankAccount = () => {
    // Mock adding a new bank account
    toast({
      title: t("accounts.accountAdded"),
      description: t("accounts.bankAccountAdded"),
    });
    setNewBankAccount({
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      isDefault: false,
    });
  };

  const handleAddMobileWallet = () => {
    // Mock adding a new mobile wallet
    toast({
      title: t("accounts.accountAdded"),
      description: t("accounts.mobileWalletAdded"),
    });
    setNewMobileWallet({
      provider: "",
      number: "",
      name: "",
      isDefault: false,
    });
  };

  const handleSetDefaultAccount = (id: number, type: 'bank' | 'mobile') => {
    // Mock setting default account
    toast({
      description: t("accounts.defaultAccountSet"),
    });
  };

  const handleDeleteAccount = (id: number, type: 'bank' | 'mobile') => {
    // Mock deleting account
    toast({
      description: t("accounts.accountDeleted"),
      variant: "destructive",
    });
  };

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t("accounts.title")}</h1>
      
      <Tabs defaultValue="bank" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bank">{t("accounts.bankAccount")}</TabsTrigger>
          <TabsTrigger value="mobile">{t("accounts.mobileWallet")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="bank" className="space-y-4">
          {/* Existing Bank Accounts */}
          <div className="space-y-2">
            {bankAccounts.map((account) => (
              <Card key={account.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">{account.bankName}</p>
                      <p className="text-sm text-muted-foreground">{account.accountNumber}</p>
                      <p className="text-sm">{account.accountHolder}</p>
                      
                      {account.isDefault && (
                        <div className="flex items-center gap-1 text-xs text-primary mt-1">
                          <Check className="h-3 w-3" />
                          <span>{t("accounts.defaultAccount")}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {!account.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultAccount(account.id, 'bank')}
                        >
                          {t("accounts.setDefault")}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteAccount(account.id, 'bank')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Add New Bank Account Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("accounts.addAccount")}</CardTitle>
              <CardDescription>{t("accounts.addBankDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bankName">{t("accounts.bankName")}</Label>
                <Input
                  id="bankName"
                  value={newBankAccount.bankName}
                  onChange={(e) => setNewBankAccount({...newBankAccount, bankName: e.target.value})}
                  placeholder={t("accounts.enterBankName")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountNumber">{t("accounts.accountNumber")}</Label>
                <Input
                  id="accountNumber"
                  value={newBankAccount.accountNumber}
                  onChange={(e) => setNewBankAccount({...newBankAccount, accountNumber: e.target.value})}
                  placeholder={t("accounts.enterAccountNumber")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="accountHolder">{t("accounts.accountHolder")}</Label>
                <Input
                  id="accountHolder"
                  value={newBankAccount.accountHolder}
                  onChange={(e) => setNewBankAccount({...newBankAccount, accountHolder: e.target.value})}
                  placeholder={t("accounts.enterAccountHolder")}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="default-bank"
                  checked={newBankAccount.isDefault}
                  onCheckedChange={(checked) => setNewBankAccount({...newBankAccount, isDefault: checked})}
                />
                <Label htmlFor="default-bank">{t("accounts.setAsDefault")}</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAddBankAccount}>
                {t("accounts.addAccount")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="mobile" className="space-y-4">
          {/* Existing Mobile Wallets */}
          <div className="space-y-2">
            {mobileWallets.map((wallet) => (
              <Card key={wallet.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-medium">{wallet.provider}</p>
                      <p className="text-sm text-muted-foreground">{wallet.number}</p>
                      <p className="text-sm">{wallet.name}</p>
                      
                      {wallet.isDefault && (
                        <div className="flex items-center gap-1 text-xs text-primary mt-1">
                          <Check className="h-3 w-3" />
                          <span>{t("accounts.defaultAccount")}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      {!wallet.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefaultAccount(wallet.id, 'mobile')}
                        >
                          {t("accounts.setDefault")}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => handleDeleteAccount(wallet.id, 'mobile')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Add New Mobile Wallet Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{t("accounts.addAccount")}</CardTitle>
              <CardDescription>{t("accounts.addWalletDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="provider">{t("accounts.provider")}</Label>
                <Input
                  id="provider"
                  value={newMobileWallet.provider}
                  onChange={(e) => setNewMobileWallet({...newMobileWallet, provider: e.target.value})}
                  placeholder={t("accounts.enterProvider")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="number">{t("accounts.mobileNumber")}</Label>
                <Input
                  id="number"
                  value={newMobileWallet.number}
                  onChange={(e) => setNewMobileWallet({...newMobileWallet, number: e.target.value})}
                  placeholder={t("accounts.enterMobileNumber")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">{t("accounts.accountName")}</Label>
                <Input
                  id="name"
                  value={newMobileWallet.name}
                  onChange={(e) => setNewMobileWallet({...newMobileWallet, name: e.target.value})}
                  placeholder={t("accounts.enterAccountName")}
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="default-mobile"
                  checked={newMobileWallet.isDefault}
                  onCheckedChange={(checked) => setNewMobileWallet({...newMobileWallet, isDefault: checked})}
                />
                <Label htmlFor="default-mobile">{t("accounts.setAsDefault")}</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleAddMobileWallet}>
                {t("accounts.addAccount")}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Accounts;
