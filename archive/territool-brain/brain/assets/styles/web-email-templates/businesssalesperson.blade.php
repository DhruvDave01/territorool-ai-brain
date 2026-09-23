@extends('mails.layout')

@section('body')



<tr>

	<td colspan="2">Dear {{ $demo->name }},</td>

</tr>

<tr>

	<td colspan="2">You have been invited by {{ $demo->business_name }} to join TerriTool. Click the button below to activate your account and set your password.</td>

</tr>

<tr>

	<td colspan="2" align="center">&nbsp;</td>

</tr>

<tr>

	<td style="color: #666666; padding: 10px; font-weight: bold; line-height: 20px;">Registered Email:</td>

	<td>{{ $demo->email }}</td>

</tr>

<tr>

	<td colspan="2" align="center">&nbsp;</td>

</tr>

<tr>

	<td colspan="2" align="center"><a href="{{ URL::to('/') }}/businesssalesperson/activate/{{ $demo->id }}" style=" background:#124AC6; padding: 10px 15px; font-size: 14px; font-weight: bold; border-radius: 10px; color: #ffffff; text-decoration: none; ">Activate my TerriTool account</a>

	</td>

</tr>

<tr>

	<td colspan="2" align="center">Welcome to TerriTool!</td>

</tr>

<tr>

	<td colspan="2" align="center">&nbsp;</td>

</tr>

<tr>

	<td colspan="2" align="center">

            If you have any issues with the link above, please contact <a href="mailto:spencer@teritool.com" target="_blank">spencer@teritool.com</a> or <a href="mailto:{{ $demo->business_email }}" target="_blank">{{ $demo->business_email }}</a>

        </td>

</tr>

@endsection

