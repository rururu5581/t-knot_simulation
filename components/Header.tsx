import React from 'react';

const Header: React.FC = () => {
  // より高品質なロゴ画像のURLに変更しました。
  const logoUrl = 'https://t-knot.com/wp-content/uploads/2022/01/logo-1.png';

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 py-4 flex items-center">
        {/* 画像の比率を維持するために object-contain を追加 */}
        <img src={logoUrl} alt="T.knot Logo" className="h-8 mr-4 object-contain" />
        <h1 className="text-xl font-bold text-gray-800">T.knot 家計診断シミュレーター</h1>
      </div>
    </header>
  );
};

export default Header;
